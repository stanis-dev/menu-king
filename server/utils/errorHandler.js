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
  const message = `Datos no validos. ${errors.join('. ')}`;

  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Token no válido. Por favor, vuelva a iniciar la sesión', 401);

const handleJWTExpiredError = () => {
  return new AppError('Token ha expirado', 401);
};

const sendErrorDev = (err, req, res) => {
  console.error('DEV ERROR 💥', err);

  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
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
  let error = { ...err };
  console.log(err);
  error.statusCode = err.statusCode || 500;
  error.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorDev(error, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    if (error.name === 'CastError') error = handleCastError(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationError(error);
    if (error.name === 'jsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
    // TODO añadir error contraseña cambiada después de haber emitido el token

    sendErrorProd(error, req, res);
  }
};
