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

// ── Disponibilidad por fechas — usa fn_habitacion_disponible ─
export const verficarDisponibilidad = async (habitacion_id, fecha_checkin, fecha_checkout) => {
    const [[row]] = await db.execute(
        'SELECT fn_habitacion_disponible(?, ?, ?, 0) AS disponible',
        [habitacion_id, fecha_checkin, fecha_checkout]
    );
    return Boolean(row.disponible);
};

// Habitaciones disponibles en un rango de fechas
export const findDisponiblesPorFechas = (fecha_checkin, fecha_checkout) =>
  db.execute(`
    SELECT h.id, h.numero, h.tipo, h.piso, h.capacidad, h.descripcion,
           fn_precio_vigente(h.id, ?) AS precio_noche
    FROM habitaciones h
    WHERE h.activo = 1
      AND fn_habitacion_disponible(h.id, ?, ?, 0) = 1
    ORDER BY h.piso, h.numero
  `, [fecha_checkin, fecha_checkin, fecha_checkout]);

// ── Precio vigente — usa fn_precio_vigente ──────────────────
export const getPrecioViginte = async (habitacion_id, fecha) => {
    const [[row]] = await db.execute(
        'SELECT fn_precio_vigente(? , ?) AS precio',
        [habitacion_id, fecha]
    );
    return row.precio;
};

// ── Escrituras ──────────────────────────────────────────────
export const insert = (data) => 
    db.execute(
        `INSERT INTO habitaciones
            (numero, tipo, piso, capacidad, precio_noche, descripcion)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [data.numero, data.tipo, data.piso,
        data.capacidad, data.precio_noche, data.descripcion ?? null]
    );

export const updateEstado = (id, estado) =>
  db.execute(
    'UPDATE habitaciones SET estado = ? WHERE id = ?',
    [estado, id]
  );

export const updatePrecio = (id, precio) =>
  db.execute(
    'UPDATE habitaciones SET precio_noche = ? WHERE id = ?',
    [precio, id]
  );

export const softDelete = (id) =>
  db.execute(
    'UPDATE habitaciones SET activo = 0 WHERE id = ?',
    [id]
  );

// ── Mantenimiento — usa sp del stored procedure ─────────────

export const abrirMantenimiento = async (habitacion_id, motivo, prioridad, responsable, usuario_id) => {
  // Cambia estado + inserta en tabla mantenimiento
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