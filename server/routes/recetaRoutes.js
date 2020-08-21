const router = require("express").Router({ mergeParams: true });
const {
  addReceta,
  setRecetaIds,
  getRecetasOfMenu,
  getReceta,
} = require("../controllers/recetaControllers");
const { authenticateUser } = require("../controllers/authController");

router.use(authenticateUser);

router
  .route("/")
  .post(setRecetaIds, addReceta)
  .get(setRecetaIds, getRecetasOfMenu);

router.route("/:recetaId").get(getReceta);

module.exports = router;
