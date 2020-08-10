const router = require('express').Router();
const {
  registro,
  login,
  logout,
  refresh,
  authenticateUser,
} = require('../controllers/authController');

router.post('/registro', registro);
router.post('/login', login);

router.use(authenticateUser);

router.post('/logout', logout);
router.post('/refresh', refresh);

module.exports = router;
