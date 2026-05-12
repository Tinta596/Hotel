import * as PlanService from '../services/planes.service.js';
import { crearPlanDto, actualizarPlanDto } from '../dtos/plan.dtos.js';

export const listar = async (req, res, next) => {
  try {
    const planes = await PlanService.listar();
    res.json(planes);
  } catch (err) { next(err); }
};

export const obtenerPorId = async (req, res, next) => {
  try {
    const plan = await PlanService.obtenerPorId(req.params.id);
    res.json(plan);
  } catch (err) { next(err); }
};

export const obtenerServiciosDePlan = async (req, res, next) => {
  try {
    const servicios = await PlanService.obtenerServiciosDePlan(req.params.id);
    res.json(servicios);
  } catch (err) { next(err); }
};

export const crear = async (req, res, next) => {
  try {
    const { error, value } = crearPlanDto.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const plan = await PlanService.crear(value);
    res.status(201).json({ message: 'Plan creado exitosamente', plan });
  } catch (err) { next(err); }
};

export const actualizar = async (req, res, next) => {
  try {
    const { error, value } = actualizarPlanDto.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const plan = await PlanService.actualizar(req.params.id, value);
    res.json({ message: 'Plan actualizado correctamente', plan });
  } catch (err) { next(err); }
};

export const desactivar = async (req, res, next) => {
  try {
    await PlanService.desactivar(req.params.id);
    res.json({ message: 'Plan desactivado correctamente' });
  } catch (err) { next(err); }
};