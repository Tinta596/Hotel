import * as ServicioService from '../services/servicio.service.js';
import { crearServicioDto, actualizarServicioDto } from '../dtos/servicio.dtos.js';

export const listar = async (req, res, next) => {
  try {
    const soloActivos = req.query.activos === 'true';
    const servicios = await ServicioService.listar(soloActivos);
    res.json(servicios);
  } catch (err) { next(err); }
};

export const obtenerPorId = async (req, res, next) => {
  try {
    const servicio = await ServicioService.obtenerPorId(req.params.id);
    res.json(servicio);
  } catch (err) { next(err); }
};

export const crear = async (req, res, next) => {
  try {
    const { error, value } = crearServicioDto.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const servicio = await ServicioService.crear(value, req.file);
    res.status(201).json({ message: 'Servicio creado exitosamente', servicio });
  } catch (err) { next(err); }
};

export const actualizar = async (req, res, next) => {
  try {
    const { error, value } = actualizarServicioDto.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const servicio = await ServicioService.actualizar(req.params.id, value, req.file);
    res.json({ message: 'Servicio actualizado exitosamente', servicio });
  } catch (err) { next(err); }
};

export const cambiarEstado = async (req, res, next) => {
  try {
    const nuevoEstado = await ServicioService.cambiarEstado(req.params.id);
    res.json({
      message: `Servicio ${nuevoEstado ? 'activado' : 'desactivado'} correctamente`,
      activo: nuevoEstado,
    });
  } catch (err) { next(err); }
};

export const eliminar = async (req, res, next) => {
  try {
    await ServicioService.eliminar(req.params.id);
    res.json({ message: 'Servicio eliminado correctamente' });
  } catch (err) { next(err); }
};

export const subirImagen = async (req, res, next) => {
  try {
    const imagen_url = await ServicioService.subirImagen(req.params.id, req.file);
    res.json({ message: 'Imagen subida correctamente', imagen_url });
  } catch (err) { next(err); }
};