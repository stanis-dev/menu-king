const catchAsync = require("../utils/catchAsync");
const Receta = require("../models/recetaModel");

exports.addReceta = catchAsync(async (req, res, next) => {
  // Normalizar receta
  const receta = {
    ...req.body,
    user: req.user._id,
    menu: "5f39910861464a35b4c6613a",
  };
  console.log(receta);
  // Enviar a base de datos
  const data = await Receta.create(receta);
  res.status(201).json({
    status: "ok",
    data,
  });
});

exports.getRecetas = catchAsync(async (req, res, next) => {
  const data = await Receta.find({ user: req.user._id });

  res.status(201).json({
    status: "ok",
    results: data.length,
    data,
  });
});
