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
router.get('/refresh', refresh);

router.use(authenticateUser);

router.get('/logout', logout);

module.exports = router;
