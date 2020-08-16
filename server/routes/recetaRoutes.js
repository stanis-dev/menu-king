const router = require("express").Router();
const {
  addReceta,
  getRecetas,
  getRecetasStats,
} = require("../controllers/recetaControllers");
const { authenticateUser } = require("../controllers/authController");

router.use(authenticateUser);

router.get("/recetaStats", getRecetasStats);
router.route("/").post(addReceta).get(getRecetas);

module.exports = router;
