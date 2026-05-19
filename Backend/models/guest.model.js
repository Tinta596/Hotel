import db from '../config/database.js';

// ── Niveles de fidelidad ──────────────────────────────────────
export const LOYALTY_LEVELS = {
  basico:       { min: 0,    descuento: 0,  label: 'Básico' },
  preferencial: { min: 500,  descuento: 5,  label: 'Preferencial' },
  vip:          { min: 1500, descuento: 10, label: 'VIP' },
  premium:      { min: 3000, descuento: 15, label: 'Premium' },
};

export const resolveLevel = (puntos) => {
  if (puntos >= 3000) return 'premium';
  if (puntos >= 1500) return 'vip';
  if (puntos >= 500)  return 'preferencial';
  return 'basico';
};

// ── Listado de huéspedes ──────────────────────────────────────
export const findAllGuests = (filters = {}) => {
  const { search = '', nivel, limit = 50, offset = 0 } = filters;
  const params = [];
  let where = `WHERE u.rol = 'cliente' AND u.eliminado_en IS NULL`;

  if (search) {
    where += ` AND (u.nombre LIKE ? OR u.email LIKE ? OR u.documento LIKE ? OR u.telefono LIKE ?)`;
    const s = `%${search}%`;
    params.push(s, s, s, s);
  }
  if (nivel) {
    where += ` AND u.nivel_fidelidad = ?`;
    params.push(nivel);
  }

  params.push(Number(limit), Number(offset));

  return db.execute(`
    SELECT
      u.id, u.nombre, u.email, u.activo,
      u.tipo_cliente, u.puntos_fidelidad, u.nivel_fidelidad,
      u.descuento_activo, u.telefono, u.documento, u.direccion,
      u.foto_perfil, u.created_at,
      COUNT(DISTINCT r.id)           AS total_reservas,
      COALESCE(SUM(r.precio_total),0) AS total_gastado,
      COALESCE(SUM(r.noches),0)      AS total_noches
    FROM usuarios u
    LEFT JOIN reservaciones r ON r.usuario_id = u.id AND r.estado != 'cancelada'
    ${where}
    GROUP BY u.id
    ORDER BY u.nombre ASC
    LIMIT ? OFFSET ?
  `, params);
};

export const countGuests = (filters = {}) => {
  const { search = '', nivel } = filters;
  const params = [];
  let where = `WHERE u.rol = 'cliente' AND u.eliminado_en IS NULL`;

  if (search) {
    where += ` AND (u.nombre LIKE ? OR u.email LIKE ? OR u.documento LIKE ? OR u.telefono LIKE ?)`;
    const s = `%${search}%`;
    params.push(s, s, s, s);
  }
  if (nivel) {
    where += ` AND u.nivel_fidelidad = ?`;
    params.push(nivel);
  }

  return db.execute(`SELECT COUNT(*) AS total FROM usuarios u ${where}`, params);
};

// ── Perfil individual ─────────────────────────────────────────
export const findGuestById = (id) =>
  db.execute(`
    SELECT
      u.id, u.nombre, u.email, u.activo, u.created_at,
      u.tipo_cliente, u.puntos_fidelidad, u.nivel_fidelidad,
      u.descuento_activo, u.telefono, u.documento, u.direccion,
      u.foto_perfil, u.notas_internas
    FROM usuarios u
    WHERE u.id = ? AND u.rol = 'cliente' AND u.eliminado_en IS NULL
  `, [id]);

// ── Estadísticas del huésped ──────────────────────────────────
export const findGuestStats = (id) =>
  db.execute(`
    SELECT
      COUNT(r.id)                    AS total_reservas,
      COALESCE(SUM(r.precio_total),0) AS total_gastado,
      COALESCE(SUM(r.noches),0)      AS total_noches,
      COUNT(CASE WHEN r.estado = 'completada' THEN 1 END) AS reservas_completadas,
      COUNT(CASE WHEN r.estado = 'cancelada'  THEN 1 END) AS reservas_canceladas,
      MAX(r.fecha_entrada)           AS ultima_visita
    FROM reservaciones r
    WHERE r.usuario_id = ?
  `, [id]);

// ── Historial de reservas ─────────────────────────────────────
export const findGuestHistory = (id) =>
  db.execute(`
    SELECT
      v.id, v.habitacion_numero, v.tipo_habitacion,
      v.fecha_entrada, v.fecha_salida, v.noches,
      v.precio_total, v.estado, v.numero_confirmacion,
      v.created_at
    FROM v_reservaciones_detalle v
    JOIN reservaciones r ON v.id = r.id
    WHERE r.usuario_id = ?
    ORDER BY v.fecha_entrada DESC
  `, [id]);

// ── Notas y preferencias ──────────────────────────────────────
export const findGuestNotes = (id) =>
  db.execute(`
    SELECT id, tipo, titulo, contenido, privada, creado_en, actualizado_en
    FROM huesped_notas
    WHERE usuario_id = ?
    ORDER BY creado_en DESC
  `, [id]);

export const insertNote = ({ usuario_id, tipo, titulo, contenido, privada }) =>
  db.execute(
    `INSERT INTO huesped_notas (usuario_id, tipo, titulo, contenido, privada) VALUES (?,?,?,?,?)`,
    [usuario_id, tipo || 'preferencia', titulo, contenido, privada ? 1 : 0]
  );

export const updateNote = (id, { tipo, titulo, contenido, privada }) =>
  db.execute(
    `UPDATE huesped_notas SET tipo=?, titulo=?, contenido=?, privada=? WHERE id=?`,
    [tipo, titulo, contenido, privada ? 1 : 0, id]
  );

export const deleteNote = (id) =>
  db.execute(`DELETE FROM huesped_notas WHERE id = ?`, [id]);

// ── Fidelidad ─────────────────────────────────────────────────
export const findLoyaltyHistory = (id) =>
  db.execute(`
    SELECT id, puntos, tipo, descripcion, reserva_id, creado_en
    FROM fidelidad_historial
    WHERE usuario_id = ?
    ORDER BY creado_en DESC
    LIMIT 20
  `, [id]);

export const addLoyaltyPoints = async (usuario_id, puntos, tipo, descripcion, reserva_id = null) => {
  await db.execute(
    `INSERT INTO fidelidad_historial (usuario_id, puntos, tipo, descripcion, reserva_id) VALUES (?,?,?,?,?)`,
    [usuario_id, puntos, tipo, descripcion, reserva_id]
  );
  // Recalcular total de puntos
  const [[{ total }]] = await db.execute(
    `SELECT COALESCE(
       SUM(CASE WHEN tipo='ganados'  THEN puntos ELSE 0 END) -
       SUM(CASE WHEN tipo='canjeados' THEN puntos ELSE 0 END),
     0) AS total FROM fidelidad_historial WHERE usuario_id = ?`,
    [usuario_id]
  );
  const nuevoNivel = resolveLevel(total);
  const descuento  = LOYALTY_LEVELS[nuevoNivel].descuento;
  await db.execute(
    `UPDATE usuarios SET puntos_fidelidad=?, nivel_fidelidad=?, descuento_activo=? WHERE id=?`,
    [total, nuevoNivel, descuento, usuario_id]
  );
  return { puntos: total, nivel: nuevoNivel };
};

// ── Actualizar perfil extendido ───────────────────────────────
export const updateGuestProfile = (id, data) => {
  const { telefono, documento, direccion, foto_perfil, notas_internas, tipo_cliente, activo } = data;
  return db.execute(`
    UPDATE usuarios SET
      telefono      = COALESCE(?, telefono),
      documento     = COALESCE(?, documento),
      direccion     = COALESCE(?, direccion),
      foto_perfil   = COALESCE(?, foto_perfil),
      notas_internas= COALESCE(?, notas_internas),
      tipo_cliente  = COALESCE(?, tipo_cliente),
      activo        = COALESCE(?, activo)
    WHERE id = ?
  `, [telefono, documento, direccion, foto_perfil, notas_internas, tipo_cliente,
      activo !== undefined ? activo : null, id]);
};
