const router = require("express").Router({ mergeParams: true });
const {
  addReceta,
  getRecetas,
  setRecetaIds,
} = require("../controllers/recetaControllers");
const { authenticateUser } = require("../controllers/authController");

router.use(authenticateUser);

router.route("/").post(setRecetaIds, addReceta).get(setRecetaIds, getRecetas);

module.exports = router;
