import db from '../config/database.js';

// ── Lecturas ────────────────────────────────────────────────
export const findAll = () => 
    db.execute(`
        SELECT p.*,
            GROUP_CONCAT(
                CONCAT(s.nombre, ' (', ps.cantidad_incluida, ')')
                SEPARATOR ', '
            ) AS servicios_incluidos
        FROM planes p
        LEFT JOIN plan_servicios ps ON p.id = ps.plan_id
        LEFT JOIN servicios s ON ps.servicio_id = s.id
        WHERE p.activo = TRUE
        GROUP BY p.id
        ORDER BY p.nombre
        `);

export const findById = (id) => 
    db.execute(`
        SELECT p.*,
           GROUP_CONCAT(
             CONCAT(s.nombre, ' (', ps.cantidad_incluida, ')')
             SEPARATOR ', '
           ) AS servicios_incluidos
        FROM planes p
        LEFT JOIN plan_servicios ps ON p.id = ps.plan_id
        LEFT JOIN servicios s      ON ps.servicio_id = s.id
        WHERE p.id = ?
        GROUP BY p.id
        `, [id]);


export const findServiciosByPlan = (plan_id) =>
  db.execute(`
    SELECT ps.*, s.nombre AS servicio_nombre, s.precio AS servicio_precio
    FROM plan_servicios ps
    JOIN servicios s ON ps.servicio_id = s.id
    WHERE ps.plan_id = ?
  `, [plan_id]);

// ── Escrituras ──────────────────────────────────────────────

export const insert = (conn, data) =>
  conn.execute(
    `INSERT INTO planes (nombre, descripcion, precio_adicional, duracion_dias)
     VALUES (?, ?, ?, ?)`,
    [data.nombre, data.descripcion ?? null,
     data.precio_adicional, data.duracion_dias]
  );

export const insertServicio = (conn, plan_id, servicio_id, cantidad_incluida) =>
  conn.execute(
    `INSERT INTO plan_servicios (plan_id, servicio_id, cantidad_incluida)
     VALUES (?, ?, ?)`,
    [plan_id, servicio_id, cantidad_incluida]
  );

export const update = (conn, id, data) => {
  const campos  = [];
  const valores = [];

  if (data.nombre           !== undefined) { campos.push('nombre = ?');           valores.push(data.nombre); }
  if (data.descripcion      !== undefined) { campos.push('descripcion = ?');      valores.push(data.descripcion); }
  if (data.precio_adicional !== undefined) { campos.push('precio_adicional = ?'); valores.push(data.precio_adicional); }
  if (data.duracion_dias    !== undefined) { campos.push('duracion_dias = ?');    valores.push(data.duracion_dias); }

  valores.push(id);
  return conn.execute(
    `UPDATE planes SET ${campos.join(', ')} WHERE id = ?`,
    valores
  );
};

// Elimina servicios del plan para reemplazarlos al actualizar
export const deleteServiciosByPlan = (conn, plan_id) =>
  conn.execute('DELETE FROM plan_servicios WHERE plan_id = ?', [plan_id]);

export const desactivar = (id) =>
  db.execute('UPDATE planes SET activo = FALSE WHERE id = ?', [id]);