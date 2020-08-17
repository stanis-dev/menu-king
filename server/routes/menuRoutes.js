const router = require("express").Router();
const { authenticateUser } = require("../controllers/authController");
const { createMenu, getMenus } = require("../controllers/menuController");

router.use(authenticateUser);

router.route("/").post(createMenu).get(getMenus);

module.exports = router;
