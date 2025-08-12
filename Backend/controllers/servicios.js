import db from "../config/database.js";

export async function obtenerServicios(req,res) {
    try {
        const [servicios] = await db.execute('SELECT * FROM servicios');
        res.json(servicios)
    } catch (error) {
        console.error('❌ Error al obtener servicios:', error);
        res.status(500).json({ error : 'Error al obtener servicios' })
    }
}

export async function crearServicio(req, res, next) {
    try {
        const {
            nombre,
            descripcion,
            precio,
            capacidad_maxima,
            horario_inicio,
            horario_fin,
            requiere_reserva
        } = req.body;

        const imagen_url = req.file ? `/uploads/servicios/${req.file.filename}` : null;
        
        const [result] = await db.execute(
            `INSERT INTO servicios 
            (nombre, descripcion, precio, capacidad_maxima, horario_inicio, horario_fin, requiere_reserva, activo, imagen_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [nombre, descripcion, precio, capacidad_maxima, horario_inicio, horario_fin, requiere_reserva, true, imagen_url]
        );

        res.status(201).json({
            message: 'Servicio creado exitosamente',
            id: result.insertId
        })
    } catch (error) {
        next(error);
    }
}

export async function subirImagen(req, res) {
  try {
    const imagenUrl = `/uploads/servicios/${req.file.filename}`;
    res.status(200).json({
      message: 'Imagen subida correctamente',
      imagen_url: imagenUrl
    });
  } catch (error) {
    console.error('❌ Error al subir imagen:', error);
    res.status(500).json({ error: 'Error al subir imagen' });
  }
}

export async function actualizarServicio(req, res) {
  const { id } = req.params;
  const {
    nombre, descripcion, precio, capacidad_maxima,
    horario_inicio, horario_fin, requiere_reserva, activo
  } = req.body;

  const imagen_url = req.file ? `/uploads/servicios/${req.file.filename}` : null;

  try {
    const updateQuery = `UPDATE servicios SET
      nombre = ?, descripcion = ?, precio = ?, capacidad_maxima = ?,
      horario_inicio = ?, horario_fin = ?, requiere_reserva = ?, activo = ?
      ${imagen_url ? ', imagen_url = ?' : ''}
      WHERE id = ?`;

    const updateParams = [
      nombre, descripcion, precio ?? null, capacidad_maxima ?? null,
      horario_inicio ?? null, horario_fin ?? null, requiere_reserva ?? false, activo,
      ...(imagen_url ? [imagen_url] : []), id
    ];

    const [result] = await db.execute(updateQuery, updateParams);

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Servicio no encontrado' });

    res.json({ message: 'Servicio actualizado exitosamente' });
  } catch (error) {
    console.error('❌ Error al actualizar servicio:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export async function eliminarServicio(req, res) {
  try {
    const [result] = await db.execute('DELETE FROM servicios WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Servicio no encontrado' });

    res.json({ message: 'Servicio eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar servicio' });
  }
}

export async function toggleActivo(req, res) {
  const { id } = req.params;

  try {
    const [[servicio]] = await db.execute('SELECT activo FROM servicios WHERE id = ?', [id]);
    if (!servicio) return res.status(404).json({ error: 'Servicio no encontrado' });

    const nuevoEstado = !servicio.activo;

    await db.execute('UPDATE servicios SET activo = ? WHERE id = ?', [nuevoEstado, id]);

    res.json({
      message: `Servicio ${nuevoEstado ? 'activado' : 'ocultado'} correctamente`,
      activo: nuevoEstado
    });
  } catch (error) {
    console.error('❌ Error al alternar estado del servicio:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export async function toggleEstadoServicio(req, res) {
    const { id } = req.params;
    console.log('🔍 ID recibido:', id);

    try {
        const [[servicio]] = await db.execute('SELECT activo FROM servicios WHERE id = ?', [id]);
        console.log('🛠 Servicio encontrado:', servicio);

        if (!servicio) {
            return res.status(404).json({ error: 'Servicio no encontrado' });
        }

        const nuevoEstado = !servicio.activo;
        console.log('📊 Nuevo estado:', nuevoEstado);

        await db.execute('UPDATE servicios SET activo = ? WHERE id = ?', [nuevoEstado, id]);

        res.json({
            message: `Servicio ${nuevoEstado ? 'activado' : 'ocultado'} correctamente`,
            activo: nuevoEstado
        });

    } catch (error) {
        console.error('❌ Error al alternar estado del servicio:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}