const catchAsync = require('../utils/catchAsync');
const Receta = require('../models/recetaModel');

exports.addReceta = catchAsync(async (req, res, next) => {
  // Normalizar receta
  const receta = { ...req.body, user: req.user._id };
  console.log(receta);
  // Enviar a base de datos
  const data = await Receta.create(receta);
  res.status(201).json({
    status: 'ok',
    data,
  });
});
