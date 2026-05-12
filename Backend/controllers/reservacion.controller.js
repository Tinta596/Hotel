// controllers/reservacion.controller.js
import * as ReservacionService from '../services/reservacion.service.js';
import { crearReservacionDto, actualizarFechasDto } from '../dtos/reservacion.dtos.js';

export const obtenerReservas = async (req, res, next) => {
  try {
    const reservas = await ReservacionService.listarReservaciones(
      req.user.rol_nombre, req.user.id
    );
    res.json(reservas);
  } catch (err) { next(err); }
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
