// controllers/habitacion.controller.js
import * as HabitacionService from '../services/habitacion.service.js';
import {
  crearHabitacionDto,
  actualizarPrecioDto,
  actualizarEstadoDto,
  disponibilidadDto,
} from '../dtos/habtacion.dtos.js';

export const listar = async (req, res, next) => {
  try {
    const habitaciones = await HabitacionService.listar();
    res.json(habitaciones);
  } catch (err) { next(err); }
};

export const listarDisponibles = async (req, res, next) => {
  try {
    const { fecha_checkin, fecha_checkout } = req.query;

    // Si vienen fechas, filtra por disponibilidad real
    const habitaciones = fecha_checkin && fecha_checkout
      ? await HabitacionService.listarDisponiblesPorFechas(fecha_checkin, fecha_checkout)
      : await HabitacionService.listarDisponibles();

    res.json(habitaciones);
  } catch (err) { next(err); }
};

export const obtenerPorId = async (req, res, next) => {
  try {
    const habitacion = await HabitacionService.obtenerPorId(req.params.id);
    res.json(habitacion);
  } catch (err) { next(err); }
};

export const verificarDisponibilidad = async (req, res, next) => {
  try {
    const { error, value } = disponibilidadDto.validate(req.query);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const disponible = await HabitacionService.verificarDisponibilidad(
      value.habitacion_id, value.fecha_checkin, value.fecha_checkout
    );
    res.json({ disponible });
  } catch (err) { next(err); }
};

export const crear = async (req, res, next) => {
  try {
    const { error, value } = crearHabitacionDto.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const habitacion = await HabitacionService.crear(value);
    res.status(201).json({ message: 'Habitación creada exitosamente', habitacion });
  } catch (err) { next(err); }
};

export const cambiarEstado = async (req, res, next) => {
  try {
    const { error, value } = actualizarEstadoDto.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    await HabitacionService.cambiarEstado(req.params.id, value.estado);
    res.json({ message: 'Estado actualizado correctamente' });
  } catch (err) { next(err); }
};

export const actualizarPrecio = async (req, res, next) => {
  try {
    const { error, value } = actualizarPrecioDto.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    await HabitacionService.actualizarPrecio(req.params.id, value.precio_base);
    res.json({ message: 'Precio actualizado correctamente' });
  } catch (err) { next(err); }
};

export const eliminar = async (req, res, next) => {
  try {
    await HabitacionService.eliminar(req.params.id);
    res.json({ message: 'Habitación eliminada correctamente' });
  } catch (err) { next(err); }
};

export const abrirMantenimiento = async (req, res, next) => {
  try {
    await HabitacionService.abrirMantenimiento(
      req.params.id, req.body, req.user.id
    );
    res.status(201).json({ message: 'Orden de mantenimiento creada' });
  } catch (err) { next(err); }
};

export const cerrarMantenimiento = async (req, res, next) => {
  try {
    await HabitacionService.cerrarMantenimiento(
      req.params.id,
      req.params.mantenimiento_id,
      req.body.notas_cierre
    );
    res.json({ message: 'Mantenimiento cerrado. Habitación disponible' });
  } catch (err) { next(err); }
};

export const listarMantenimientos = async (req, res, next) => {
  try {
    const mantenimientos = await HabitacionService.listarMantenimientos(req.params.id);
    res.json(mantenimientos);
  } catch (err) { next(err); }
};