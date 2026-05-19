import * as ReservacionService from '../services/reservacion.service.js';
import { crearReservacionDto, actualizarFechasDto, calcularPrecioDto } from '../dtos/reservacion.dtos.js';

export const calcularPrecio = async (req, res, next) => {
  try {
    const { error, value } = calcularPrecioDto.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const total = await ReservacionService.calcularPrecio(value);
    res.json({ total });
  } catch (err) { next(err); }
};

export const obtenerReservas = async (req, res, next) => {
  try {
    const rol = req.user?.rol_nombre || 'cliente';
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'Usuario no identificado' });
    }

    const reservas = await ReservacionService.listarReservaciones(rol, userId);
    res.json(reservas || []);
  } catch (err) {
    console.error('[ReservasController] Error en obtenerReservas:', err);
    next(err);
  }
};

export const crearReserva = async (req, res, next) => {
  try {
    const { error, value } = crearReservacionDto.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const reserva = await ReservacionService.crearReservacion(value, req.user);
    res.status(201).json({ message: 'Reserva creada exitosamente', reserva });
  } catch (err) { next(err); }
};

export const verificarDisponibilidad = async (req, res, next) => {
  try {
    const { habitacion_id, fecha_checkin, fecha_checkout } = req.query;
    const disponible = await ReservacionService.verificarDisponibilidad(
      habitacion_id, fecha_checkin, fecha_checkout
    );
    res.json({ disponible });
  } catch (err) { next(err); }
};

export const actualizarEstadoReserva = async (req, res, next) => {
  try {
    await ReservacionService.actualizarEstado(req.params.id, req.body.estado);
    res.json({ message: 'Estado actualizado exitosamente' });
  } catch (err) { next(err); }
};

export const cancelarReserva = async (req, res, next) => {
  try {
    await ReservacionService.cancelarReservacion(req.params.id);
    res.json({ message: 'Reserva cancelada exitosamente' });
  } catch (err) { next(err); }
};

export const actualizarFechasReserva = async (req, res, next) => {
  try {
    const { error, value } = actualizarFechasDto.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    await ReservacionService.actualizarFechas(
      req.params.id, value.fecha_checkin, value.fecha_checkout, value.habitacion_id
    );
    res.json({ message: 'Fechas actualizadas correctamente' });
  } catch (err) { next(err); }
};

export const obtenerHabitacionesDisponibles = async (req, res, next) => {
  try {
    const habitaciones = await ReservacionService.listarHabitacionesDisponibles();
    res.json(habitaciones);
  } catch (err) { next(err); }
};

export const obtenerHabitaciones = async (req, res, next) => {
  try{
    const habitaciones = await ReservacionService.listarHabitacionesDisponibles();
    res.json(habitaciones);
  }
  catch (error){
    next(error);
  }
}

export const obtenerHabitacionPorId = async (req, res, next) => {
  try {
    const habitacion = await ReservacionService.obtenerHabitacion(req.params.id);
    res.json(habitacion);
  } catch (err) { next(err); }
};

export const actualizarPrecioHabitacion = async (req, res, next) => {
  try {
    await ReservacionService.actualizarPrecio(req.params.id, req.body.precio_base);
    res.json({ message: 'Precio actualizado correctamente' });
  } catch (err) { next(err); }
};

export const obtenerOcupacion = async (req, res, next) => {
  try {
    const ocupacion = await ReservacionService.obtenerOcupacion(req.params.habitacion_id);
    res.json(ocupacion);
  } catch (err) { next(err); }
};

export const registrarConsumo = async (req, res, next) => {
  try {
    const { servicio_id, cantidad } = req.body;
    if (!servicio_id) {
      return res.status(400).json({ error: 'El campo servicio_id es obligatorio' });
    }

    const resultado = await ReservacionService.registrarConsumoServicio(
      req.params.id,
      servicio_id,
      cantidad || 1
    );
    res.status(200).json(resultado);
  } catch (err) { next(err); }
};

