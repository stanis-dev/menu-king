const router = require("express").Router();
const { authenticateUser } = require("../controllers/authController");
const {
  createMenu,
  getMenus,
  deleteMenu,
  checkMenuIdParam,
  patchMenu,
} = require("../controllers/menuController");
const recetaRouter = require("./recetaRoutes");

router.use("/:menuId/recetas", recetaRouter);

router.use(authenticateUser);

router.param("menu", checkMenuIdParam);

router.route("/").post(createMenu).get(getMenus);

router.route("/:menu").delete(deleteMenu).patch(patchMenu);

module.exports = router;
