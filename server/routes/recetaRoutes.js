const router = require('express').Router();
const { addReceta } = require('../controllers/recetaControllers');
const { authenticateUser } = require('../controllers/authController');

router.post('/', authenticateUser, addReceta);

module.exports = router;
