// dtos/habitacion.dto.js
import Joi from 'joi';

export const crearHabitacionDto = Joi.object({
  numero:           Joi.string().max(10).required(),
  tipo:             Joi.string().valid('individual','doble','suite','familiar').required(),
  piso:             Joi.number().integer().min(1).required(),
  capacidad:        Joi.number().integer().min(1).required(),
  precio_noche:     Joi.number().positive().required(),
  descripcion:      Joi.string().max(500).optional().allow(''),
});

export const actualizarPrecioDto = Joi.object({
  precio_base: Joi.number().positive().required(),
});

export const actualizarEstadoDto = Joi.object({
  estado: Joi.string()
    .valid('disponible','reservada','ocupada','limpieza','mantenimiento')
    .required(),
});

export const disponibilidadDto = Joi.object({
  habitacion_id:  Joi.number().integer().positive().required(),
  fecha_checkin:  Joi.date().min('now').required(),
  fecha_checkout: Joi.date().greater(Joi.ref('fecha_checkin')).required(),
});