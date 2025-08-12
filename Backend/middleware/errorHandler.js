const errorHandler = (err,  res) => {
  const isDev = process.env.NODE_ENV === 'development'

  console.error('[ErrorHandler]', err.stack || err);


  // 1. Error de validacion de Joi
  if(err.isJoi){
    return res.status(400).json({
      error: 'Datos de entrada inválidos',
      detalles: err.details?.map(detail => detail.message)
    });
  }

  // 2. Error de base de datos por tabla/campo no encontrado
  if (err.code === 'ER_NO_SUCH_TABLE' || err.code === 'ER_BAD_FIELD_ERROR') {
    return res.status(500).json({
      error: 'Error en la base de datos: tabla o campo inexistente',
      detalle: err.message
    })
  }

  // 3. Error de clave duplicada en MySQL
  if (err.code === 'ER_DUP_ENTRY'){
    return res.status(409).json({
      error : 'El recurso ya existe'
    });
  }

  // 4. Otros errores de MySQL
  if (err.sqlMessage){
    return res.status(500).json({
      error: 'Error en la base de datos',
      detalle: err.sqlMessage
    });
  }

  // 5. Error genérico
  return res.status(500).json({
    error: 'Error interno del servidor',
    mensaje: err.message || 'Sin mensaje'
  })
};

export default errorHandler;