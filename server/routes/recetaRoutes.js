const router = require("express").Router({ mergeParams: true });
const {
  addReceta,
  setRecetaIds,
  getRecetasOfMenu,
  getReceta,
  updateReceta,
} = require("../controllers/recetaControllers");
const { authenticateUser } = require("../controllers/authController");

router.use(authenticateUser);

router
  .route("/")
  .post(setRecetaIds, addReceta)
  .get(setRecetaIds, getRecetasOfMenu);

router.route("/:recetaId").get(getReceta).put(updateReceta);

module.exports = router;
