const Menu = require("../models/menuModel");
const Receta = require("../models/recetaModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.createMenu = catchAsync(async (req, res, next) => {
  const newMenu = {
    menuName: req.body.menuName,
    pax: req.body.pax,
    user: req.user._id,
  };

  const menuCreated = await Menu.create(newMenu);

  res.status(201).json({
    status: "success",
    data: menuCreated,
  });
});

exports.getMenus = catchAsync(async (req, res, next) => {
  const menus = await Menu.find({ user: req.user._id });

  res.status(200).json({
    status: "success",
    data: menus,
  });
});

exports.deleteMenu = catchAsync(async (req, res, next) => {
  const menuId = req.params.id;

  if (!menuId) {
    return next(new AppError("No se encuentra el id del menu"));
  }

  await Menu.findByIdAndDelete(menuId, async () => {
    await Receta.deleteMany({ menu: menuId });
  });

  res.status(204).json({
    status: "success",
  });
});
