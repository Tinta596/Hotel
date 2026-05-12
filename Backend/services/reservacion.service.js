import * as ReservacionModel from '../models/reservacion.model.js';

const ESTADOS_VALIDOS = ['pendiente', 'confirmada', "en_curso", 'completada', 'cancelada'];

export const listarReservaciones = async (rol, usuario_id) => {
    switch (rol){
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

    if (!disponible){
        throw { status: 409, message: 'La habitación no está disponible para esas fechas' };
    }

    const [result] = await ReservacionModel.insert({ ...data, usuario_id: final_usuario_id});
    const [[reserva]] = await ReservacionModel.findById(result.insertId);
    return reserva;
};

export const verificarDisponibilidad = async (habitacion_id, fecha_checkin, fecha_checkout) => {
    if(!habitacion_id || !fecha_checkin || !fecha_checkout) {
        throw new Error(400, 'Faltan parámetros: habitacion_id, fecha_checkin, fecha_checkout');
    }

    return ReservacionModel.verificarDisponibilidadSP(habitacion_id, fecha_checkin, fecha_checkout);
}


export const actualizarEstado = async (id, estado) => {
    if(!ESTADOS_VALIDOS.includes(estado)){
        throw new Error(400, 'Estado inválido');
    }

    const [result] = await ReservacionModel.updateEstado(id, estado);
    if (result.affectedRows === 0){
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
    habitacion_id, fecha_checkin, fecha_checkout
  );
  if (!disponible) throw { status: 409, message: 'La habitación no está disponible para esas fechas' };

  const [result] = await ReservacionModel.updateFechas(id, fecha_checkin, fecha_checkout, habitacion_id);
  if (result.affectedRows === 0) throw { status: 404, message: 'Reserva no encontrada' };
};

export const listarHabitacionesDisponibles = async () => {
  const [rows] = await ReservacionModel.findHabitacionesDisponibles();
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