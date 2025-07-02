const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Error de validación de Joi
  if (err.isJoi) {
    return res.status(400).json({
      error: 'Datos de entrada inválidos',
      details: err.details.map(detail => detail.message)
    });
  }

  // Error de base de datos
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      error: 'El recurso ya existe'
    });
  }

  // Error genérico
  res.status(500).json({
    error: 'Error interno del servidor'
  });
};

module.exports = errorHandler;