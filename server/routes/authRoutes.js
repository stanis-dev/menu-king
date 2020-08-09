const router = require('express').Router();
const {
  registro,
  login,
  logout,
  refresh,
} = require('../controllers/authController');

router.post('/registro', registro);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refresh);

module.exports = router;
