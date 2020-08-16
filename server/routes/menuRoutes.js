const router = require("express").Router();
const { authenticateUser } = require("../controllers/authController");
const { createMenu } = require("../controllers/menuController");

router.use(authenticateUser);

router.post("/", createMenu);

module.exports = router;
