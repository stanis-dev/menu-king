const catchAsync = require('../utils/catchAsync');
const Receta = require('../models/recetaModel');

exports.addReceta = catchAsync(async (req, res, next) => {
  // Normalizar receta
  // Enviar a base de datos
  const data = await Receta.create(req.body);
  res.status(201).json({
    status: 'ok',
    data,
  });
});
