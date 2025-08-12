import db from "../config/database.js";
import Joi from 'joi';
const {ref} = Joi

const reservaSchema = Joi.object({
    habitacion_id: Joi.number().integer().positive().required(),
    plan_id: Joi.number().integer().positive().optional(),
    fecha_checkin: Joi.date().min('now').required(),
    fecha_checkout: Joi.date().greater(ref('fecha_checkin')).required(),
    numero_huespedes: Joi.number().integer().min(1).max(10).required(),
    notas: Joi.string().max(500).optional()
});

export async function obtenerReservas(req, res, next) {
    try {
        let query = '';
        let params = [];

        switch (req.user.rol_nombre){
            case 'admin':
                query = ` 
            SELECT r.*, u.nombre as cliente_nombre, u.email as cliente_email,
                 h.numero as habitacion_numero, th.nombre as tipo_habitacion,
                 p.nombre as plan_nombre
            FROM reservas r
            JOIN usuarios u ON r.usuario_id = u.id
            JOIN habitaciones h ON r.habitacion_id = h.id
            JOIN tipos_habitacion th ON h.tipo_habitacion_id = th.id
            LEFT JOIN planes p ON r.plan_id = p.id
            ORDER BY r.created_at DESC
            `;

            case 'trabajador':
                query = `
                SELECT r.id, r.fecha_checkin, r.fecha_checkout, r.numero_huespedes, r.estado,
                        u.nombre as cliente_nombre, u.telefono as cliente_telefono,
                        h.numero as habitacion_numero, th.nombre as tipo_habitacion,
                        p.nombre as plan_nombre
                FROM reservas r
                JOIN usuarios u ON r.usuario_id = u.id
                JOIN habitaciones h ON r.habitacion_id = h.id
                JOIN tipos_habitacion th ON h.tipo_habitacion_id = th.id
                LEFT JOIN planes p ON r.plan_id = p.id
                WHERE r.estado IN ('confirmada', 'en_curso')
                ORDER BY r.fecha_checkin ASC
                `;
                break;

            default:
                query = `
                SELECT r.*, h.numero as habitacion_numero, th.nombre as tipo_habitacion,
                        p.nombre as plan_nombre
                FROM reservas r
                JOIN habitaciones h ON r.habitacion_id = h.id
                JOIN tipos_habitacion th ON h.tipo_habitacion_id = th.id
                LEFT JOIN planes p ON r.plan_id = p.id
                WHERE r.usuario_id = ?
                ORDER BY r.created_at DESC
                `;
                params = [req.user.id];
            }

        const [reservas] = await db.execute(query, params);
        res.json(reservas);
    } catch (error) {
        next(error);
    }
}

export async function crearReserva(req, res) {
    try {
    const { error, value } = reservaSchema.validate(req.body);
    if (error) throw error;

    const {
      habitacion_id,
      plan_id = null,
      fecha_checkin,
      fecha_checkout,
      numero_huespedes,
      notas
    } = value;

    const usuario_id = req.user.rol_nombre === 'admin' ? req.body.usuario_id || req.user.id : req.user.id;

    if (req.user.rol_nombre === 'admin' && req.body.usuario_id) {
      const [userCheck] = await db.execute('SELECT id FROM usuarios WHERE id = ?', [req.body.usuario_id]);
      if (userCheck.length === 0) {
        return res.status(400).json({ error: 'Usuario no válido' });
      }
    }

    await db.execute(
      'CALL verificar_disponibilidad_habitacion(?, ?, ?, @disponible)',
      [habitacion_id, fecha_checkin, fecha_checkout]
    );

    const [[{ disponible }]] = await db.execute('SELECT @disponible as disponible');
    if (!disponible) {
      return res.status(409).json({ error: 'La habitación no está disponible para esas fechas' });
    }

    const [insertResult] = await db.execute(
      'INSERT INTO reservas (usuario_id, habitacion_id, plan_id, fecha_checkin, fecha_checkout, numero_huespedes, notas, precio_total) VALUES (?, ?, ?, ?, ?, ?, ?, 0)',
      [usuario_id, habitacion_id, plan_id, fecha_checkin, fecha_checkout, numero_huespedes, notas]
    );

    const [nuevaReserva] = await db.execute(
      `
      SELECT r.*, h.numero as habitacion_numero, th.nombre as tipo_habitacion, p.nombre as plan_nombre
      FROM reservas r
      JOIN habitaciones h ON r.habitacion_id = h.id
      JOIN tipos_habitacion th ON h.tipo_habitacion_id = th.id
      LEFT JOIN planes p ON r.plan_id = p.id
      WHERE r.id = ?
      `,
      [insertResult.insertId]
    );

    res.status(201).json({
      message: 'Reserva creada exitosamente',
      reserva: nuevaReserva[0]
    });
  } catch (error) {
    next(error);
  }
}

export async function obtenerHabitacionesDisponibles(req, res) {
  try {
    const [habitaciones] = await db.execute(`
      SELECT h.id, h.numero, h.imagen_url, h.estado, th.nombre as tipo_nombre, th.precio_base
      FROM habitaciones h
      JOIN tipos_habitacion th ON h.tipo_habitacion_id = th.id
      WHERE h.estado = 'disponible'
    `);
    res.json(habitaciones);
  } catch (error) {
    console.error("❌ Error en obtenerHabitacionesDisponibles:", error); 
    res.status(500).json({ error: 'Error al obtener habitaciones' });
  }
}

export async function obtenerHabitacionPorId(req, res) {
  const { id } = req.params;
  try {
    const [[habitacion]] = await db.execute(`
      SELECT h.id, h.numero, h.estado, h.descripcion, h.piso, h.imagen_url,
             th.nombre AS tipo_nombre, th.precio_base, th.capacidad_personas
      FROM habitaciones h
      JOIN tipos_habitacion th ON h.tipo_habitacion_id = th.id
      WHERE h.id = ?
    `, [id]);

    if (!habitacion) {
      return res.status(404).json({ error: 'Habitación no encontrada' });
    }

    res.json(habitacion);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export async function actualizarEstadoReserva(req, res, next) {
  try {
    const { estado } = req.body;
    const validStates = ['pendiente', 'confirmada', 'en_curso', 'completada', 'cancelada'];

    if (!validStates.includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    const [result] = await db.execute('UPDATE reservas SET estado = ? WHERE id = ?', [estado, req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Reserva no encontrada' });

    res.json({ message: 'Estado actualizado exitosamente' });
  } catch (error) {
    next(error);
  }
}

export async function cancelarReserva(req, res, next) {
  try {
    const [result] = await db.execute('UPDATE reservas SET estado = "cancelada" WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Reserva no encontrada' });
    res.json({ message: 'Reserva cancelada exitosamente' });
  } catch (error) {
    next(error);
  }
}

export async function verificarDisponibilidad(req, res, next) {
  const { habitacion_id, fecha_checkin, fecha_checkout } = req.query;
  try {
    await db.execute('CALL verificar_disponibilidad_habitacion(?, ?, ?, @disponible)', [
      habitacion_id, fecha_checkin, fecha_checkout
    ]);
    const [[{ disponible }]] = await db.execute('SELECT @disponible AS disponible');
    res.json({ disponible });
  } catch (error) {
    next(error);
  }
}

export async function reservarConServicios(req, res, next) {
  const conn = await db.getConnection();
  try {
    const {
      habitacion_id, usuario_id, fecha_checkin,
      fecha_checkout, numero_huespedes, plan_id = null, servicios = []
    } = req.body;

    if (!fecha_checkin || !fecha_checkout || new Date(fecha_checkin) >= new Date(fecha_checkout)) {
      return res.status(400).json({ error: 'Fechas inválidas' });
    }

    if (req.user.rol_nombre === 'admin' && usuario_id) {
      const [userCheck] = await db.execute('SELECT id FROM usuarios WHERE id = ?', [usuario_id]);
      if (userCheck.length === 0) return res.status(400).json({ error: 'Usuario no válido' });
    }

    await conn.beginTransaction();

    const [reservaResult] = await conn.execute(
      'INSERT INTO reservas (usuario_id, habitacion_id, plan_id, fecha_checkin, fecha_checkout, numero_huespedes, estado, precio_total) VALUES (?, ?, ?, ?, ?, ?, "confirmada", 0)',
      [usuario_id, habitacion_id, plan_id, fecha_checkin, fecha_checkout, numero_huespedes]
    );

    const reservaId = reservaResult.insertId;

    for (let servicioId of servicios) {
      await conn.execute('INSERT INTO reserva_servicio (reserva_id, servicio_id) VALUES (?, ?)', [reservaId, servicioId]);
    }

    await conn.execute('UPDATE habitaciones SET estado = "ocupada" WHERE id = ?', [habitacion_id]);

    const [reservaCreate] = await conn.execute(`
      SELECT r.*, h.numero as habitacion_numero, th.nombre as tipo_habitacion, p.nombre as plan_nombre
      FROM reservas r
      JOIN habitaciones h ON r.habitacion_id = h.id
      JOIN tipos_habitacion th ON h.tipo_habitacion_id = th.id
      LEFT JOIN planes p ON r.plan_id = p.id
      WHERE r.id = ?
    `, [reservaId]);

    await conn.commit();
    res.status(201).json({ message: 'Reserva registrada con plan y servicios', reserva: reservaCreate[0] });

  } catch (error) {
    await conn.rollback();
    console.error('Error al reservar:', error);
    res.status(500).json({ error: 'Error al reservar' });
  } finally {
    conn.release();
  }
}

export async function actualizarFechasReserva(req, res, next) {
  try {
    const { id } = req.params;
    const { fecha_checkin, fecha_checkout, habitacion_id } = req.body;

    if (!fecha_checkin || !fecha_checkout || new Date(fecha_checkin) >= new Date(fecha_checkout)) {
      return res.status(400).json({ error: 'Fechas inválidas' });
    }

    const [result] = await db.execute(
      'UPDATE reservas SET fecha_checkin = ?, fecha_checkout = ?, habitacion_id = ? WHERE id = ?',
      [fecha_checkin, fecha_checkout, habitacion_id, id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Reserva no encontrada' });

    res.json({ message: 'Fechas actualizadas correctamente' });
  } catch (error) {
    next(error);
  }
}

export async function obtenerHabitaciones(req, res) {
  try {
    const [habitaciones] = await db.execute(`
      SELECT h.id, h.numero, h.estado, h.descripcion, h.piso,
             th.nombre AS tipo_nombre, th.precio_base, th.capacidad_personas
      FROM habitaciones h
      JOIN tipos_habitacion th ON h.tipo_habitacion_id = th.id
      ORDER BY h.numero
    `);
    res.json(habitaciones);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener habitaciones' });
  }
}

export async function actualizarPrecioHabitacion(req, res) {
  const { id } = req.params;
  const { precio_base } = req.body;

  if (!precio_base || isNaN(precio_base) || precio_base <= 0) {
    return res.status(400).json({ error: 'Precio inválido' });
  }

  try {
    const [[habitacion]] = await db.execute('SELECT tipo_habitacion_id FROM habitaciones WHERE id = ?', [id]);
    if (!habitacion) return res.status(404).json({ error: 'Habitación no encontrada' });

    await db.execute('UPDATE tipos_habitacion SET precio_base = ? WHERE id = ?', [
      precio_base, habitacion.tipo_habitacion_id
    ]);

    res.json({ message: 'Precio actualizado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}