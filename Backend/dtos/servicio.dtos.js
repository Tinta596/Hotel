import Joi from 'joi';

export const crearServicioDto = Joi.object({
    nombre:           Joi.string().max(100).required(),
    descripcion:      Joi.string().max(500).optional().allow(''),
    precio:           Joi.number().min(0).required(),
    categoria:        Joi.string()
                        .valid('restaurante','spa','lavanderia','transporte','minibar','otro')
                        .default('otro'),
    capacidad_maxima: Joi.number().integer().min(1).optional().allow(null),
    horario_inicio:   Joi.string().pattern(/^\d{2}:\d{2}$/).optional().allow(null),
    horario_fin:      Joi.string().pattern(/^\d{2}:\d{2}$/).optional().allow(null),
    requiere_reserva: Joi.boolean().default(false),
});

export const actualizarServicioDto = Joi.object({
  nombre:           Joi.string().max(100).optional(),
  descripcion:      Joi.string().max(500).optional().allow(''),
  precio:           Joi.number().min(0).optional(),
  categoria:        Joi.string()
                      .valid('restaurante','spa','lavanderia','transporte','minibar','otro')
                      .optional(),
  capacidad_maxima: Joi.number().integer().min(1).optional().allow(null),
  horario_inicio:   Joi.string().pattern(/^\d{2}:\d{2}$/).optional().allow(null),
  horario_fin:      Joi.string().pattern(/^\d{2}:\d{2}$/).optional().allow(null),
  requiere_reserva: Joi.boolean().optional(),
  activo:           Joi.boolean().optional(),
}).min(1);