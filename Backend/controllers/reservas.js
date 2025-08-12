import db from '../config/database.js';
import Joi from 'joi'
const {ref} = Joi
import * as reservasService from '../services/reservas.js';

// Validación
const reservaSchema = Joi.object({
  habitacion_id: Joi.number().integer().positive().required(),
  plan_id: Joi.number().integer().positive().optional(),
  fecha_checkin: Joi.date().min('now').required(),
  fecha_checkout: Joi.date().greater(ref('fecha_checkin')).required(),
  numero_huespedes: Joi.number().integer().min(1).max(10).required(),
  notas: Joi.string().max(500).optional()
});

// GET: reservas según rol
export async function obtenerReservas(req, res, next) {
  try {
    let query, params = [];

    if (req.user.rol_nombre === 'admin') {
      query = `SELECT r.*, u.nombre as cliente_nombre, u.email as cliente_email,
               h.numero as habitacion_numero, th.nombre as tipo_habitacion, p.nombre as plan_nombre
               FROM reservas r
               JOIN usuarios u ON r.usuario_id = u.id
               JOIN habitaciones h ON r.habitacion_id = h.id
               JOIN tipos_habitacion th ON h.tipo_habitacion_id = th.id
               LEFT JOIN planes p ON r.plan_id = p.id
               ORDER BY r.created_at DESC`;
    } else if (req.user.rol_nombre === 'trabajador') {
      query = `SELECT r.id, r.fecha_checkin, r.fecha_checkout, r.numero_huespedes, r.estado,
               u.nombre as cliente_nombre, u.telefono as cliente_telefono,
               h.numero as habitacion_numero, th.nombre as tipo_habitacion, p.nombre as plan_nombre
               FROM reservas r
               JOIN usuarios u ON r.usuario_id = u.id
               JOIN habitaciones h ON r.habitacion_id = h.id
               JOIN tipos_habitacion th ON h.tipo_habitacion_id = th.id
               LEFT JOIN planes p ON r.plan_id = p.id
               WHERE r.estado IN ('confirmada', 'en_curso')
               ORDER BY r.fecha_checkin ASC`;
    } else {
      query = `SELECT r.*, h.numero as habitacion_numero, th.nombre as tipo_habitacion,
               p.nombre as plan_nombre
               FROM reservas r
               JOIN habitaciones h ON r.habitacion_id = h.id
               JOIN tipos_habitacion th ON h.tipo_habitacion_id = th.id
               LEFT JOIN planes p ON r.plan_id = p.id
               WHERE r.usuario_id = ?
               ORDER BY r.created_at DESC`;
      params = [req.user.id];
    }

    const [reservas] = await db.execute(query, params);
    res.json(reservas);
  } catch (error) {
    next(error);
  }
}

// POST: nueva reserva
export async function crearReserva(req, res, next) {
  try {
    const { error, value } = reservaSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const {
      habitacion_id, plan_id = null, fecha_checkin,
      fecha_checkout, numero_huespedes, notas = ''
    } = value;

    const usuario_id = req.user.id;

    await db.execute('CALL verificar_disponibilidad_habitacion(?, ?, ?, @disponible)', [habitacion_id, fecha_checkin, fecha_checkout]);
    const [[{ disponible }]] = await db.execute('SELECT @disponible AS disponible');
    if (!disponible) return res.status(409).json({ error: 'La habitación no está disponible para esas fechas' });

    const [insertResult] = await db.execute(
      `INSERT INTO reservas 
      (usuario_id, habitacion_id, plan_id, fecha_checkin, fecha_checkout, numero_huespedes, notas, estado, precio_total)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pendiente', 0)`,
      [usuario_id, habitacion_id, plan_id, fecha_checkin, fecha_checkout, numero_huespedes, notas]
    );

    const [nuevaReserva] = await db.execute(`
      SELECT r.*, h.numero as habitacion_numero, th.nombre as tipo_habitacion, p.nombre as plan_nombre
      FROM reservas r
      JOIN habitaciones h ON r.habitacion_id = h.id
      JOIN tipos_habitacion th ON h.tipo_habitacion_id = th.id
      LEFT JOIN planes p ON r.plan_id = p.id
      WHERE r.id = ?
    `, [insertResult.insertId]);

    res.status(201).json({ message: 'Reserva creada exitosamente', reserva: nuevaReserva[0] });
  } catch (error) {
    console.error('❌ Error al crear reserva:', error);
    res.status(500).json({ error: 'Error interno al crear la reserva' });
  }
}

// PUT: cambiar estado
export async function cambiarEstadoReserva(req, res, next) {
  try {
    const { estado } = req.body;
    const estadosValidos = ['pendiente', 'confirmada', 'en_curso', 'completada', 'cancelada'];

    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    const [result] = await db.execute('UPDATE reservas SET estado = ? WHERE id = ?', [estado, req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Reserva no encontrada' });

    res.json({ message: 'Estado actualizado exitosamente' });
  } catch (error) {
    next(error);
  }
}

// PUT: cancelar reserva
export async function cancelarReserva(req, res, next) {
  try {
    const reservaId = req.params.id;
    const [rows] = await db.execute('SELECT habitacion_id FROM reservas WHERE id = ?', [reservaId]);
    if (rows.length === 0) return res.status(404).json({ error: 'Reserva no encontrada' });

    const habitacionId = rows[0].habitacion_id;

    const [update] = await db.execute('UPDATE reservas SET estado = "cancelada" WHERE id = ?', [reservaId]);
    if (update.affectedRows === 0) return res.status(404).json({ error: 'No se pudo cancelar la reserva' });

    const [otras] = await db.execute(`
      SELECT id FROM reservas 
      WHERE habitacion_id = ? AND estado IN ('confirmada', 'en_curso')`, [habitacionId]);

    if (otras.length === 0) {
      await db.execute(`UPDATE habitaciones SET estado = 'disponible' WHERE id = ?`, [habitacionId]);
    }

    res.json({ message: 'Reserva cancelada exitosamente' });
  } catch (error) {
    next(error);
  }
}

// POST: reservar con servicios
export async function reservarConServicios(req, res, next) {
  const conn = await db.getConnection();
  try {
    const {
      habitacion_id, usuario_id, fecha_checkin, fecha_checkout,
      numero_huespedes, plan_id = null, servicios = []
    } = req.body;

    await conn.beginTransaction();

    await conn.query('CALL verificar_disponibilidad_habitacion(?, ?, ?, @disponible)', [habitacion_id, fecha_checkin, fecha_checkout]);
    const [[{ disponible }]] = await conn.query('SELECT @disponible as disponible');
    if (!disponible) {
      await conn.rollback();
      return res.status(409).json({ error: 'Habitación no disponible para esas fechas' });
    }

    const [insertResult] = await conn.query(
      `INSERT INTO reservas (usuario_id, habitacion_id, plan_id, fecha_checkin, fecha_checkout, numero_huespedes, precio_total)
       VALUES (?, ?, ?, ?, ?, ?, 0)`,
      [usuario_id, habitacion_id, plan_id, fecha_checkin, fecha_checkout, numero_huespedes]
    );

    for (const servicio of servicios) {
      await conn.query(
        'INSERT INTO reserva_servicios (reserva_id, servicio_id) VALUES (?, ?)',
        [insertResult.insertId, servicio.id]
      );
    }

    await conn.commit();

    const [detalles] = await db.execute(`
      SELECT r.*, h.numero as habitacion_numero, th.nombre as tipo_habitacion, p.nombre as plan_nombre
      FROM reservas r
      JOIN habitaciones h ON r.habitacion_id = h.id
      JOIN tipos_habitacion th ON h.tipo_habitacion_id = th.id
      LEFT JOIN planes p ON r.plan_id = p.id
      WHERE r.id = ?`, [insertResult.insertId]);

    res.status(201).json({ message: 'Reserva creada con servicios', reserva: detalles[0] });
  } catch (error) {
    await conn.rollback();
    next(error);
  } finally {
    conn.release();
  }
}

// GET: verificar disponibilidad
export async function verificarDisponibilidad(req, res, next) {
  try {
    const { habitacion_id, fecha_checkin, fecha_checkout } = req.query;
    if (!habitacion_id || !fecha_checkin || !fecha_checkout) {
      return res.status(400).json({ error: 'Faltan parámetros requeridos' });
    }

    await db.execute('CALL verificar_disponibilidad_habitacion(?, ?, ?, @disponible)', [habitacion_id, fecha_checkin, fecha_checkout]);
    const [[{ disponible }]] = await db.execute('SELECT @disponible as disponible');

    res.json({ disponible: disponible === 1 });
  } catch (error) {
    next(error);
  }
}

// GET: habitaciones
export async function listarHabitaciones(req, res, next) {
  try {
    const [habitaciones] = await db.execute(`
      SELECT h.*, th.nombre as tipo_habitacion
      FROM habitaciones h
      JOIN tipos_habitacion th ON h.tipo_habitacion_id = th.id
      ORDER BY h.numero ASC
    `);
    res.json(habitaciones);
  } catch (error) {
    next(error);
  }
}

// GET: habitaciones disponibles
export async function listarHabitacionesDisponibles(req, res, next) {
  try {
    const { fecha_checkin, fecha_checkout } = req.query;
    if (!fecha_checkin || !fecha_checkout) {
      return res.status(400).json({ error: 'Fechas requeridas' });
    }

    const query = `
      SELECT h.*, th.nombre as tipo_habitacion, th.precio_base
      FROM habitaciones h
      JOIN tipos_habitacion th ON h.tipo_habitacion_id = th.id
      WHERE h.estado = 'disponible'
      AND NOT EXISTS (
        SELECT 1 FROM reservas r
        WHERE r.habitacion_id = h.id
        AND r.estado IN ('confirmada', 'en_curso')
        AND (
          (r.fecha_checkin <= ? AND r.fecha_checkout > ?)
          OR (r.fecha_checkin < ? AND r.fecha_checkout >= ?)
          OR (r.fecha_checkin >= ? AND r.fecha_checkout <= ?)
        )
      )`;

    const params = [
      fecha_checkin, fecha_checkin,
      fecha_checkout, fecha_checkout,
      fecha_checkin, fecha_checkout
    ];

    const [habitaciones] = await db.execute(query, params);
    res.json(habitaciones);
  } catch (error) {
    next(error);
  }
}

// PUT: actualizar fechas
export async function actualizarFechas(req, res) {
  try {
    const { id } = req.params;
    const { fecha_checkin, fecha_checkout } = req.body;
    await db.execute(
      'UPDATE reservas SET fecha_checkin = ?, fecha_checkout = ? WHERE id = ?',
      [fecha_checkin, fecha_checkout, id]
    );
    res.json({ message: 'Fechas actualizadas correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar fechas' });
  }
}

// DELETE: eliminar reserva
export async function eliminarReserva(req, res, next) {
  try {
    const [result] = await db.execute('DELETE FROM reservas WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Reserva no encontrada' });
    res.json({ message: 'Reserva eliminada permanentemente' });
  } catch (error) {
    next(error);
  }
}

// Calcular Gastos
export async function calcularPrecioReserva(req, res, next) {
  try {
    const { fecha_checkin, fecha_checkout, tipo_habitacion_id, plan_id } = req.body;

    if (!fecha_checkin || !fecha_checkout || !tipo_habitacion_id) {
      return res.status(400).json({
        error: 'Faltan datos: fecha_checkin, fecha_checkout o tipo_habitacion_id'
      });
    }

    const total = await reservasService.calcularPrecioTotal(
      fecha_checkin,
      fecha_checkout,
      tipo_habitacion_id,
      plan_id
    );

    res.json({ total });
  } catch (error) {
    console.error('Error en calcularPrecioReserva:', error.message);
    next(error);
  }
}