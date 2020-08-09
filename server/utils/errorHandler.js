const AppError = require('./appError');

exports.errorClassifier = (err, req, res, next) => {
  if (err.code === 11000) {
    next(
      new AppError(
        'Esta cuenta parece ya estar registrada. ¿Necesitas recuperar tu contraseña?',
        400,
        true
      )
    );
  } else if (err.isError) {
    next(err);
  }

  console.log('🐞 Error occurred!: ' + err.message);
  console.log(err);
  next(new AppError('Huston, tenemos un problemilla', 500, false));
};

exports.errorHandler = (err, req, res, next) => {
  res.status(err.status).json({
    status: `${err.isError ? 'error' : 'fail'}`,
    error: err.message,
  });
};
