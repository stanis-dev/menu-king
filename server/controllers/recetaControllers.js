const catchAsync = require("../utils/catchAsync");
const Receta = require("../models/recetaModel");

exports.setRecetaIds = (req, res, next) => {
  if (!req.body.menuId) req.body.menuId = req.params.menuId;
  if (!req.body.userId) req.body.userId = req.user._id;

  next();
};

exports.addReceta = catchAsync(async (req, res, next) => {
  // Normalizar receta
  const receta = {
    ...req.body,
    user: req.user._id,
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
