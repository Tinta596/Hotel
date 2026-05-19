import * as ReservacionModel from '../models/reservacion.model.js';
import * as ServicioModel from '../models/servicios.model.js';
import db from '../config/database.js';

const ESTADOS_VALIDOS = ['pendiente', 'confirmada', "en_curso", 'completada', 'cancelada'];

export const calcularPrecio = async (data) => {
  const { habitacion_id, fecha_checkin, fecha_checkout, plan_id } = data;

  const entrada = new Date(fecha_checkin);
  const salida = new Date(fecha_checkout);
  const noches = Math.max(1, Math.ceil((salida - entrada) / (1000 * 60 * 60 * 24)));

  // Obtener precio base de la habitación
  const [[habitacion]] = await db.execute('SELECT precio_base FROM habitaciones WHERE id = ?', [habitacion_id]);
  if (!habitacion) throw { status: 404, message: 'Habitación no encontrada' };

  let total = habitacion.precio_base * noches;

  // Si hay plan, sumar precio adicional
  if (plan_id) {
    const [[plan]] = await db.execute('SELECT precio_adicional FROM planes WHERE id = ?', [plan_id]);
    if (plan) {
      // Asumimos que el precio del plan es diario
      total += (parseFloat(plan.precio_adicional) * noches);
    }
  }

  return total;
};

export const listarReservaciones = async (rol, usuario_id) => {
  switch (rol) {
    case 'admin': {
      const [rows] = await ReservacionModel.findAllAdmin();
      return rows;
    }
    case 'trabajador': {
      const [rows] = await ReservacionModel.findAllTrabajador();
      return rows;
    }
    default: {
      const [rows] = await ReservacionModel.findByUsuario(usuario_id);
      return rows;
    }
  }
};

export const crearReservacion = async (data, usuario) => {
  const final_usuario_id = (usuario.rol_nombre === 'admin' || usuario.rol_nombre === 'trabajador') && data.usuario_id
    ? data.usuario_id
    : usuario.id;

  const disponible = await ReservacionModel.verificarDisponibilidadSP(
    data.habitacion_id, data.fecha_checkin, data.fecha_checkout
  );

  if (!disponible) {
    throw { status: 409, message: 'La habitación no está disponible para esas fechas' };
  }

  const [result] = await ReservacionModel.insert({ ...data, usuario_id: final_usuario_id });
  const [[reserva]] = await ReservacionModel.findById(result.insertId);

  // Asignar puntos de fidelidad automáticamente (1pt por $1.000 COP)
  if (reserva?.precio_total > 0) {
    try {
      const { asignarPuntosPorReserva } = await import('./guest.service.js');
      await asignarPuntosPorReserva(final_usuario_id, reserva.precio_total, result.insertId);
    } catch (_) { /* No bloquear si falla */ }
  }

  return reserva;
};

export const verificarDisponibilidad = async (habitacion_id, fecha_checkin, fecha_checkout) => {
  if (!habitacion_id || !fecha_checkin || !fecha_checkout) {
    throw new Error(400, 'Faltan parámetros: habitacion_id, fecha_checkin, fecha_checkout');
  }

  return ReservacionModel.verificarDisponibilidadSP(habitacion_id, fecha_checkin, fecha_checkout);
}


export const actualizarEstado = async (id, estado) => {
  if (!ESTADOS_VALIDOS.includes(estado)) {
    throw new Error(400, 'Estado inválido');
  }

  const [result] = await ReservacionModel.updateEstado(id, estado);
  if (result.affectedRows === 0) {
    throw new Error(404, 'Reserva no encontrada');
  }
}

export const cancelarReservacion = async (id) => {
  const [result] = await ReservacionModel.updateEstado(id, 'cancelada');
  if (result.affectedRows === 0) throw { status: 404, message: 'Reserva no encontrada' };
};

export const actualizarFechas = async (id, fecha_checkin, fecha_checkout, habitacion_id) => {
  // Verificar disponibilidad antes de actualizar
  const disponible = await ReservacionModel.verificarDisponibilidadSP(
    habitacion_id, fecha_checkin, fecha_checkout, id
  );
  if (!disponible) throw { status: 409, message: 'La habitación no está disponible para esas fechas' };

  const [result] = await ReservacionModel.updateFechas(id, fecha_checkin, fecha_checkout, habitacion_id);
  if (result.affectedRows === 0) throw { status: 404, message: 'Reserva no encontrada' };
};

export const listarHabitacionesDisponibles = async () => {
  const [rows] = await ReservacionModel.findHabitacionesDisponibles();
  return rows;
};

export const obtenerOcupacion = async (habitacion_id) => {
  const [rows] = await ReservacionModel.findFechasOcupadas(habitacion_id);
  return rows;
};

export const obtenerHabitacion = async (id) => {
  const [[habitacion]] = await ReservacionModel.findHabitacionById(id);
  if (!habitacion) throw { status: 404, message: 'Habitación no encontrada' };
  return habitacion;
};

export const actualizarPrecio = async (id, precio_base) => {
  if (!precio_base || isNaN(precio_base) || precio_base <= 0) {
    throw { status: 400, message: 'Precio inválido' };
  }
  const [[habitacion]] = await ReservacionModel.findTipoHabitacionByHabitacionId(id);
  if (!habitacion) throw { status: 404, message: 'Habitación no encontrada' };
  await ReservacionModel.updatePrecioHabitacion(habitacion.tipo_habitacion_id, precio_base);
};

export const obtenerHabitaciones = async (req, res) => {
  try {
    const habitaciones = await Habitacion.findAll();
    res.json(habitaciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const registrarConsumoServicio = async (reserva_id, servicio_id, cantidad) => {
  const [[reserva]] = await ReservacionModel.findById(reserva_id);
  if (!reserva) {
    throw { status: 404, message: 'Reservación no encontrada' };
  }

  const [[servicio]] = await ServicioModel.findById(servicio_id);
  if (!servicio) {
    throw { status: 404, message: 'Servicio no encontrado' };
  }

  const precioUnitario = servicio.precio || 0;
  const cant = parseInt(cantidad) || 1;

  await ReservacionModel.insertOrUpdateServicioConsumido(reserva_id, servicio_id, precioUnitario, cant);

  return {
    success: true,
    message: 'Consumo registrado exitosamente',
    servicio: servicio.nombre,
    precio_unitario: precioUnitario,
    cantidad: cant
  };
};