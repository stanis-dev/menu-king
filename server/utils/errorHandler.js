const AppError = require('./appError');

const handleCastError = (err) => {
  return new AppError(`El campo ${err.path} no válido: ${err.value} `);
};

const handleDuplicateFieldsDB = (err) => {
  //Extraer el valor entre las comillas
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];

  const message = `Valor duplicado: ${value}. Por favor, uilize otro valor.`;

  return new AppError(message, 400);
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Datos no validos. ${error.join('. ')}`;

  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Token no válido. Por favor, vuelva a iniciar la sesión', 401);

const handleJWTExpiredError = () =>
  new AppError(
    'Token ha expirado. Utilice refreshToken o vuelva a iniciar la sesión',
    401
  );

const sendErrorDev = (err, req, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, req, res) => {
  // Errores Operacionales, enviar mensaje al cliente
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  // Errores desconocidos. Logear y enviar mensaje generico
  console.error('ERROR 💥', err);

  return res.status(500).json({
    status: 'error',
    message: 'Algo ha fallado',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.name === 'CastError') error = handleCastError(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationError(error);
    if (error.name === 'jsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
