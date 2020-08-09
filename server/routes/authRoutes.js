const router = require('express').Router();
const { registro, login, logout } = require('../controllers/authController');

router.post('/registro', registro);
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;
