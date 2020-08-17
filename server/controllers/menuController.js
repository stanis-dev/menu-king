const Menu = require("../models/menuModel");
const catchAsync = require("../utils/catchAsync");

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
