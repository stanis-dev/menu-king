const router = require("express").Router();
const { authenticateUser } = require("../controllers/authController");
const {
  createMenu,
  getMenus,
  deleteMenu,
  checkMenuIdParam,
  patchMenu,
} = require("../controllers/menuController");

router.use(authenticateUser);
router.param("menu", checkMenuIdParam);

router.route("/").post(createMenu).get(getMenus);

router.route("/:menu").delete(deleteMenu).patch(patchMenu);

module.exports = router;
