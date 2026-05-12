import Joi from 'joi';

export const crearReservacionDto = Joi.object({
  habitacion_id:    Joi.number().integer().positive().required(),
  usuario_id:       Joi.number().integer().positive().optional(),
  plan_id:          Joi.number().integer().positive().optional().allow(null),
  fecha_checkin:    Joi.date().required(),
  fecha_checkout:   Joi.date().required(),
  numero_huespedes: Joi.number().integer().min(1).max(10).required(),
  notas:            Joi.string().max(500).optional().allow('', null),
  servicios:        Joi.array().items(Joi.number().integer().positive()).optional()
}).unknown(true);

export const actualizarFechasDto = Joi.object({
  fecha_checkin:  Joi.date().required(),
  fecha_checkout: Joi.date().greater(Joi.ref('fecha_checkin')).required(),
  habitacion_id:  Joi.number().integer().positive().required(),
});