const router = require('express').Router();
const { addReceta } = require('../controllers/recetaControllers');

router.post('/', addReceta);

module.exports = router;
