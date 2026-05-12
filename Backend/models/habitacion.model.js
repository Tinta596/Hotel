import db from '../config/database.js';

// ── Lecturas — usan las VISTAS que creamos ──────────────────

// Usa v_habitaciones_estado (incluye huésped activo si hay)
export const findAll = () => 
    db.execute(`
        SELECT * FROM v_habitaciones_estado ORDER BY piso, numero
    `);

// Habitaciones disponibles en este momento
export const findDisponibles = () => 
    db.execute(`
        SELECT * FROM v_habitaciones_estado
        WHERE estado = 'disponible'
        ORDER BY piso, numero
    `);

// Detalle de una habitación por id
export const findById = (id) =>
    db.execute(
        'SELECT * FROM v_habitaciones_estado WHERE id = ?',
        [id]
    );

// ── Disponibilidad por fechas ───────────────────────────────
export const verificarDisponibilidad = async (habitacion_id, fecha_checkin, fecha_checkout) => {
    const [rows] = await db.execute(
        `SELECT COUNT(*) AS count 
         FROM reservaciones 
         WHERE habitacion_id = ? 
           AND estado IN ('confirmada', 'checkin') 
           AND fecha_entrada < ? 
           AND fecha_salida > ?`,
        [habitacion_id, fecha_checkout, fecha_checkin]
    );
    return rows[0].count === 0;
};

// Habitaciones disponibles en un rango de fechas
export const findDisponiblesPorFechas = (fecha_checkin, fecha_checkout) =>
  db.execute(`
    SELECT h.id, h.numero, t.nombre AS tipo, h.piso, t.capacidad, h.descripcion,
           h.precio_base AS precio_noche
    FROM habitaciones h
    JOIN tipos_habitacion t ON h.tipo_id = t.id
    WHERE h.activa = 1
      AND h.id NOT IN (
        SELECT habitacion_id 
        FROM reservaciones 
        WHERE estado IN ('confirmada', 'checkin') 
          AND fecha_entrada < ? 
          AND fecha_salida > ?
      )
    ORDER BY h.piso, h.numero
  `, [fecha_checkout, fecha_checkin]);

// ── Precio vigente ──────────────────────────────────────────
export const getPrecioVigente = async (habitacion_id, fecha) => {
    const [[row]] = await db.execute(
        'SELECT precio_base AS precio FROM habitaciones WHERE id = ?',
        [habitacion_id]
    );
    return row?.precio || 0;
};

// ── Escrituras ──────────────────────────────────────────────
export const insert = (data) => 
    db.execute(
        `INSERT INTO habitaciones
            (numero, tipo_id, piso, precio_base, descripcion, activa)
        VALUES (?, ?, ?, ?, ?, 1)`,
        [data.numero, data.tipo_id, data.piso,
        data.precio_base, data.descripcion ?? null]
    );

export const updateEstado = (id, estado) =>
  db.execute(
    'UPDATE habitaciones SET estado = ? WHERE id = ?',
    [estado, id]
  );

export const updatePrecio = (id, precio) =>
  db.execute(
    'UPDATE habitaciones SET precio_base = ? WHERE id = ?',
    [precio, id]
  );

export const softDelete = (id) =>
  db.execute(
    'UPDATE habitaciones SET activa = 0 WHERE id = ?',
    [id]
  );

// ── Mantenimiento ───────────────────────────────────────────

export const abrirMantenimiento = async (habitacion_id, motivo, prioridad, responsable, usuario_id) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    await conn.execute(
      'UPDATE habitaciones SET estado = "mantenimiento" WHERE id = ?',
      [habitacion_id]
    );

    await conn.execute(
      `INSERT INTO mantenimiento
        (habitacion_id, motivo, prioridad, responsable, usuario_id)
       VALUES (?, ?, ?, ?, ?)`,
      [habitacion_id, motivo, prioridad, responsable ?? null, usuario_id]
    );

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

export const cerrarMantenimiento = async (mantenimiento_id, notas_cierre, habitacion_id) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    await conn.execute(
      `UPDATE mantenimiento
       SET estado = 'completado', fecha_fin_real = NOW(), notas_cierre = ?
       WHERE id = ?`,
      [notas_cierre ?? null, mantenimiento_id]
    );

    await conn.execute(
      'UPDATE habitaciones SET estado = "disponible" WHERE id = ?',
      [habitacion_id]
    );

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

export const findMantenimientos = (habitacion_id) =>
  db.execute(
    `SELECT * FROM mantenimiento WHERE habitacion_id = ? ORDER BY fecha_inicio DESC`,
    [habitacion_id]
  );