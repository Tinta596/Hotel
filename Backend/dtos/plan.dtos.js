// dtos/plan.dto.js
import Joi from 'joi';

export const crearPlanDto = Joi.object({
  nombre:           Joi.string().max(100).required(),
  descripcion:      Joi.string().max(500).optional().allow(''),
  precio_adicional: Joi.number().min(0).required(),
  duracion_dias:    Joi.number().integer().min(1).required(),
  servicios: Joi.array().items(
    Joi.object({
      servicio_id:       Joi.number().integer().positive().required(),
      cantidad_incluida: Joi.number().integer().min(1).required(),
    })
  ).optional().default([]),
});

export const actualizarPlanDto = Joi.object({
  nombre:           Joi.string().max(100).optional(),
  descripcion:      Joi.string().max(500).optional().allow(''),
  precio_adicional: Joi.number().min(0).optional(),
  duracion_dias:    Joi.number().integer().min(1).optional(),
  servicios: Joi.array().items(
    Joi.object({
      servicio_id:       Joi.number().integer().positive().required(),
      cantidad_incluida: Joi.number().integer().min(1).required(),
    })
  ).optional(),
}).min(1);