const catchAsync = require("../utils/catchAsync");
const Receta = require("../models/recetaModel");
const Menu = require("../models/menuModel");

exports.setRecetaIds = (req, res, next) => {
  if (!req.body.menu) req.body.menuId = req.params.menuId;
  if (!req.body.userId) req.body.userId = req.user._id;

  next();
};

exports.addReceta = catchAsync(async (req, res, next) => {
  // Normalizar receta
  const receta = {
    ...req.body,
    user: req.user._id,
    menu: req.body.menu,
  };

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

exports.getRecetasOfMenu = catchAsync(async (req, res, next) => {
  const recetas = await Receta.find({ menu: req.body.menuId });

  console.log(req.body.menuId);

  res.status(200).json({
    status: "ok",
    results: recetas.length,
    data: recetas,
  });
});
