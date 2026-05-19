import db from '../config/database.js';

// ── Consultas de reservaciones ──────────────────────────────

export const findAllAdmin = () =>
  db.execute(`
    SELECT v.*, r.habitacion_id 
    FROM v_reservaciones_detalle v
    JOIN reservaciones r ON v.id = r.id
    ORDER BY v.created_at DESC
  `);

export const findAllTrabajador = () =>
  db.execute(`
    SELECT v.*, r.habitacion_id 
    FROM v_reservaciones_detalle v
    JOIN reservaciones r ON v.id = r.id
    WHERE v.estado IN ('confirmada', 'checkin')
    ORDER BY v.fecha_entrada ASC
  `);

export const findByUsuario = (usuario_id) =>
  db.execute(`
    SELECT v.*, r.usuario_id, r.habitacion_id 
    FROM v_reservaciones_detalle v
    JOIN reservaciones r ON v.id = r.id
    WHERE r.usuario_id = ? 
    ORDER BY v.created_at DESC
  `, [usuario_id]);

export const findById = (id) =>
  db.execute('SELECT * FROM v_reservaciones_detalle WHERE id = ?', [id]);

export const insert = async (data) => {
  const numero_confirmacion = `RES-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  
  // Calcular noches
  const entrada = new Date(data.fecha_checkin);
  const salida = new Date(data.fecha_checkout);
  const noches = Math.ceil((salida - entrada) / (1000 * 60 * 60 * 24));

  const [result] = await db.execute(
    `INSERT INTO reservaciones
      (usuario_id, habitacion_id, plan_id, fecha_entrada, fecha_salida, adultos, notas, precio_total, numero_confirmacion, noches, estado)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmada')`,
    [
      data.usuario_id, 
      data.habitacion_id, 
      data.plan_id || null,
      data.fecha_checkin, 
      data.fecha_checkout, 
      data.numero_huespedes || 1, 
      data.notas || null,
      data.precio_total || 0,
      numero_confirmacion,
      noches > 0 ? noches : 1
    ]
  );

  // Si hay servicios, insertarlos (esto requiere lógica adicional en el service para calcular precios)
  if (data.servicios && data.servicios.length > 0) {
    for (const servicio_id of data.servicios) {
      await db.execute(
        'INSERT INTO reserva_servicios (reserva_id, servicio_id, precio_unitario, cantidad) VALUES (?, ?, 0, 1)',
        [result.insertId, servicio_id]
      );
    }
  }

  return [result];
};

export const updateEstado = (id, estado) =>
  db.execute('UPDATE reservaciones SET estado = ? WHERE id = ?', [estado, id]);

export const updateFechas = (id, fecha_checkin, fecha_checkout, habitacion_id) => {
  const entrada = new Date(fecha_checkin);
  const salida = new Date(fecha_checkout);
  const noches = Math.ceil((salida - entrada) / (1000 * 60 * 60 * 24));

  return db.execute(
    'UPDATE reservaciones SET fecha_entrada = ?, fecha_salida = ?, habitacion_id = ?, noches = ? WHERE id = ?',
    [fecha_checkin, fecha_checkout, habitacion_id, noches > 0 ? noches : 1, id]
  );
};

// ── Consultas de habitaciones ───────────────────────────────

export const findHabitacionesDisponibles = () =>
  db.execute(`
    SELECT * FROM v_habitaciones_estado 
    WHERE estado = 'disponible' 
    AND activa = 1
  `);

export const findHabitacionById = (id) =>
  db.execute('SELECT * FROM v_habitaciones_estado WHERE id = ?', [id]);

export const updateEstadoHabitacion = (id, estado) =>
  db.execute('UPDATE habitaciones SET estado = ? WHERE id = ?', [estado, id]);

export const updatePrecioHabitacion = (tipo_habitacion_id, precio) =>
  db.execute('UPDATE habitaciones SET precio_noche = ? WHERE tipo_id = ?', [precio, tipo_habitacion_id]);

export const findTipoHabitacionByHabitacionId = (id) =>
  db.execute('SELECT tipo_id AS tipo_habitacion_id FROM habitaciones WHERE id = ?', [id]);

// ── Disponibilidad (Consulta Directa) ──

export const verificarDisponibilidadSP = async (habitacion_id, fecha_checkin, fecha_checkout, exclude_reserva_id = null) => {
  let query = `
     SELECT COUNT(*) AS count 
     FROM reservaciones 
     WHERE habitacion_id = ? 
       AND estado IN ('confirmada', 'checkin') 
       AND fecha_entrada < ? 
       AND fecha_salida > ?
  `;
  const params = [habitacion_id, fecha_checkout, fecha_checkin];

  if (exclude_reserva_id) {
    query += ` AND id != ?`;
    params.push(exclude_reserva_id);
  }

  const [rows] = await db.execute(query, params);
  return rows[0].count === 0;
};

export const findFechasOcupadas = (habitacion_id) =>
  db.execute(
    `SELECT fecha_entrada, fecha_salida 
     FROM reservaciones 
     WHERE habitacion_id = ? 
       AND estado IN ('confirmada', 'checkin')`,
    [habitacion_id]
  );

export const obtenerHabitaciones = async (req, res) => {
  try {
    const [habitaciones] = await db.execute('SELECT * FROM v_habitaciones_estado');
    return res.status(200).json({
      ok: true,
      data: habitaciones
    });
  } catch (error) {
    console.error('Error al obtener habitaciones:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al obtener habitaciones'
    });
  }
};

export const findServiciosByReservaId = (reserva_id) =>
  db.execute(
    `SELECT s.nombre, rs.cantidad, rs.precio_unitario, (rs.cantidad * rs.precio_unitario) AS subtotal
     FROM reserva_servicios rs
     JOIN servicios s ON rs.servicio_id = s.id
     WHERE rs.reserva_id = ?`,
    [reserva_id]
  );

export const findFacturaData = (id) =>
  db.execute(
    `SELECT v.*, u.nombre AS cliente_nombre, u.email AS cliente_email, u.telefono AS cliente_telefono, u.documento AS cliente_documento
     FROM v_reservaciones_detalle v
     JOIN reservaciones r ON v.id = r.id
     JOIN usuarios u ON r.usuario_id = u.id
     WHERE v.id = ?`,
    [id]
  );

export const insertOrUpdateServicioConsumido = async (reserva_id, servicio_id, precio_unitario, cantidad) => {
  const [existente] = await db.execute(
    'SELECT * FROM reserva_servicios WHERE reserva_id = ? AND servicio_id = ?',
    [reserva_id, servicio_id]
  );

  if (existente.length > 0) {
    return db.execute(
      'UPDATE reserva_servicios SET cantidad = cantidad + ?, precio_unitario = ? WHERE reserva_id = ? AND servicio_id = ?',
      [cantidad, precio_unitario, reserva_id, servicio_id]
    );
  } else {
    return db.execute(
      'INSERT INTO reserva_servicios (reserva_id, servicio_id, precio_unitario, cantidad) VALUES (?, ?, ?, ?)',
      [reserva_id, servicio_id, precio_unitario, cantidad]
    );
  }
};


