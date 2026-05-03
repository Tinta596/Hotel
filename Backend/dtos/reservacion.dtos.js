import Joi from 'joi';

export const crearReservacionDto = Joi.object({
  habitacion_id:    Joi.number().integer().positive().required(),
  plan_id:          Joi.number().integer().positive().optional(),
  fecha_checkin:    Joi.date().min('now').required(),
  fecha_checkout:   Joi.date().greater(Joi.ref('fecha_checkin')).required(),
  numero_huespedes: Joi.number().integer().min(1).max(10).required(),
  notas:            Joi.string().max(500).optional().allow(''),
});

export const actualizarFechasDto = Joi.object({
  fecha_checkin:  Joi.date().required(),
  fecha_checkout: Joi.date().greater(Joi.ref('fecha_checkin')).required(),
  habitacion_id:  Joi.number().integer().positive().required(),
});