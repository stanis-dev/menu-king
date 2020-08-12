const router = require('express').Router();
const { addReceta, getRecetas } = require('../controllers/recetaControllers');
const { authenticateUser } = require('../controllers/authController');

router.use(authenticateUser);

router.route('/').post(addReceta).get(getRecetas);

module.exports = router;
