const appError = require('./appError');

exports.errorClassifier = (err, req, res, next) => {
  if (err.code === 11000) {
    next(
      new appError(
        'Esta cuenta parece ya estar registrada. ¿Necesitas recuperar tu contraseña?',
        400,
        true
      )
    );
  }

  console.log('🐞 Error occurred!: ' + err.message);
  console.log(err);
  next(new appError('Huston, tenemos un problemilla', 500, false));
};

exports.errorHandler = (err, req, res, next) => {
  res.status(err.status).json({
    status: `${err.isError ? 'error' : 'fail'}`,
    error: err.message,
  });
};
