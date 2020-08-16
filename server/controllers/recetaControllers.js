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

exports.getRecetasStats = async (req, res, next) => {
  try {
    const stats = await Receta.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: null,
          totalKcals: { $sum: "$analisisNutricional.caloriasTotal" },
          totalProts: { $sum: "$analisisNutricional.prot" },
          totalCarbs: { $sum: "$analisisNutricional.carbs" },
          totalAzucares: { $sum: "$analisisNutricional.azucares" },
          totalGrasas: { $sum: "$analisisNutricional.grasas" },
          totalSaturadas: { $sum: "$analisisNutricional.saturadas" },
        },
      },
    ]);
    res.status(200).json({
      status: "success",
      data: stats,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "fail",
      err,
    });
  }
};
