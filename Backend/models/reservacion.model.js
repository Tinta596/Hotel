import db from '../config/database.js';

// ── Consultas de reservaciones ──────────────────────────────

export const findAllAdmin = () =>
  db.execute(`
    SELECT r.*, u.nombre AS cliente_nombre, u.email AS cliente_email,
           h.numero AS habitacion_numero, th.nombre AS tipo_habitacion,
           p.nombre AS plan_nombre
    FROM reservas r
    JOIN usuarios u         ON r.usuario_id    = u.id
    JOIN habitaciones h     ON r.habitacion_id = h.id
    JOIN tipos_habitacion th ON h.tipo_habitacion_id = th.id
    LEFT JOIN planes p      ON r.plan_id = p.id
    ORDER BY r.created_at DESC
  `);

export const findAllTrabajador = () =>
  db.execute(`
    SELECT r.id, r.fecha_checkin, r.fecha_checkout, r.numero_huespedes, r.estado,
           u.nombre AS cliente_nombre, u.telefono AS cliente_telefono,
           h.numero AS habitacion_numero, th.nombre AS tipo_habitacion,
           p.nombre AS plan_nombre
    FROM reservas r
    JOIN usuarios u         ON r.usuario_id    = u.id
    JOIN habitaciones h     ON r.habitacion_id = h.id
    JOIN tipos_habitacion th ON h.tipo_habitacion_id = th.id
    LEFT JOIN planes p      ON r.plan_id = p.id
    WHERE r.estado IN ('confirmada', 'en_curso')
    ORDER BY r.fecha_checkin ASC
  `);

export const findByUsuario = (usuario_id) =>
  db.execute(`
    SELECT r.*, h.numero AS habitacion_numero,
           th.nombre AS tipo_habitacion, p.nombre AS plan_nombre
    FROM reservas r
    JOIN habitaciones h     ON r.habitacion_id = h.id
    JOIN tipos_habitacion th ON h.tipo_habitacion_id = th.id
    LEFT JOIN planes p      ON r.plan_id = p.id
    WHERE r.usuario_id = ?
    ORDER BY r.created_at DESC
  `, [usuario_id]);

export const findById = (id) =>
  db.execute(`
    SELECT r.*, h.numero AS habitacion_numero,
           th.nombre AS tipo_habitacion, p.nombre AS plan_nombre
    FROM reservas r
    JOIN habitaciones h     ON r.habitacion_id = h.id
    JOIN tipos_habitacion th ON h.tipo_habitacion_id = th.id
    LEFT JOIN planes p      ON r.plan_id = p.id
    WHERE r.id = ?
  `, [id]);

export const insert = (data) =>
  db.execute(
    `INSERT INTO reservas
      (usuario_id, habitacion_id, plan_id, fecha_checkin, fecha_checkout, numero_huespedes, notas, precio_total)
     VALUES (?, ?, ?, ?, ?, ?, ?, 0)`,
    [data.usuario_id, data.habitacion_id, data.plan_id,
     data.fecha_checkin, data.fecha_checkout, data.numero_huespedes, data.notas]
  );

export const updateEstado = (id, estado) =>
  db.execute('UPDATE reservas SET estado = ? WHERE id = ?', [estado, id]);

export const updateFechas = (id, fecha_checkin, fecha_checkout, habitacion_id) =>
  db.execute(
    'UPDATE reservas SET fecha_checkin = ?, fecha_checkout = ?, habitacion_id = ? WHERE id = ?',
    [fecha_checkin, fecha_checkout, habitacion_id, id]
  );

// ── Consultas de habitaciones ───────────────────────────────

export const findHabitacionesDisponibles = () =>
  db.execute(`
    SELECT h.id, h.numero, h.imagen_url, h.estado,
           th.nombre AS tipo_nombre, th.precio_base
    FROM habitaciones h
    JOIN tipos_habitacion th ON h.tipo_habitacion_id = th.id
    WHERE h.estado = 'disponible'
  `);

export const findHabitacionById = (id) =>
  db.execute(`
    SELECT h.id, h.numero, h.estado, h.descripcion, h.piso, h.imagen_url,
           th.nombre AS tipo_nombre, th.precio_base, th.capacidad_personas
    FROM habitaciones h
    JOIN tipos_habitacion th ON h.tipo_habitacion_id = th.id
    WHERE h.id = ?
  `, [id]);

export const updateEstadoHabitacion = (id, estado) =>
  db.execute('UPDATE habitaciones SET estado = ? WHERE id = ?', [estado, id]);

export const updatePrecioHabitacion = (tipo_habitacion_id, precio) =>
  db.execute('UPDATE tipos_habitacion SET precio_base = ? WHERE id = ?', [precio, tipo_habitacion_id]);

export const findTipoHabitacionByHabitacionId = (id) =>
  db.execute('SELECT tipo_habitacion_id FROM habitaciones WHERE id = ?', [id]);

// ── Disponibilidad via stored procedure ─────────────────────

export const verificarDisponibilidadSP = async (habitacion_id, fecha_checkin, fecha_checkout) => {
  await db.execute(
    'CALL verificar_disponibilidad_habitacion(?, ?, ?, @disponible)',
    [habitacion_id, fecha_checkin, fecha_checkout]
  );
  const [[row]] = await db.execute('SELECT @disponible AS disponible');
  return Boolean(row.disponible);
};