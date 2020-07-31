const appError = require('./appError');

exports.errorClassifier = (err, req, res, next) => {
  if (err.code === 11000)
    next(
      new appError(
        'Esta cuenta parece ya estar registrada. ¿Necesitas recuperar tu contraseña?',
        400,
        true
      )
    );
};

exports.errorHandler = (err, req, res, next) => {
  console.log(err);
  if (err.isError) {
    res.status(err.status).json({
      status: 'error',
      error: err.message,
    });
  } else {
    res.status(500).json({
      status: 'fail',
      err,
    });
  }
};
