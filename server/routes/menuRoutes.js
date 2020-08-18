const router = require("express").Router();
const { authenticateUser } = require("../controllers/authController");
const {
  createMenu,
  getMenus,
  deleteMenu,
} = require("../controllers/menuController");

router.use(authenticateUser);

router.route("/").post(createMenu).get(getMenus);

router.route("/:id").delete(deleteMenu);

module.exports = router;
