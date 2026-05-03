import db from '../config/database.js';

export const findAll = () =>
  db.execute(`
    SELECT * FROM servicios
    ORDER BY categoria, nombre
  `);

export const findActivos = () =>
  db.execute(`
    SELECT * FROM servicios
    WHERE activo = TRUE
    ORDER BY categoria, nombre
  `);

export const findById = (id) =>
  db.execute('SELECT * FROM servicios WHERE id = ?', [id]);

export const insert = (data) =>
  db.execute(
    `INSERT INTO servicios
      (nombre, descripcion, precio, categoria, capacidad_maxima,
       horario_inicio, horario_fin, requiere_reserva, imagen_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.nombre,
      data.descripcion   ?? null,
      data.precio,
      data.categoria     ?? 'otro',
      data.capacidad_maxima ?? null,
      data.horario_inicio   ?? null,
      data.horario_fin      ?? null,
      data.requiere_reserva ?? false,
      data.imagen_url       ?? null,
    ]
  );

export const update = (id, data) => {
  const campos  = [];
  const valores = [];

  const mapeables = [
    'nombre','descripcion','precio','categoria',
    'capacidad_maxima','horario_inicio','horario_fin',
    'requiere_reserva','activo','imagen_url'
  ];

  for (const campo of mapeables) {
    if (data[campo] !== undefined) {
      campos.push(`${campo} = ?`);
      valores.push(data[campo]);
    }
  }

  valores.push(id);
  return db.execute(
    `UPDATE servicios SET ${campos.join(', ')} WHERE id = ?`,
    valores
  );
};

export const toggleActivo = async (id) => {
  const [[servicio]] = await db.execute(
    'SELECT activo FROM servicios WHERE id = ?', [id]
  );
  if (!servicio) return null;

  const nuevoEstado = !servicio.activo;
  await db.execute(
    'UPDATE servicios SET activo = ? WHERE id = ?',
    [nuevoEstado, id]
  );
  return nuevoEstado;
};

// Soft delete — nunca borrar físico
export const softDelete = (id) =>
  db.execute(
    'UPDATE servicios SET activo = FALSE WHERE id = ?', [id]
  );

export const updateImagen = (id, imagen_url) =>
  db.execute(
    'UPDATE servicios SET imagen_url = ? WHERE id = ?',
    [imagen_url, id]
  );