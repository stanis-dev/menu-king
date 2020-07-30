const router = require('express').Router();
const User = require('../models/userModel');
const { registro } = require('../controllers/authController');

router.post('/registro', registro);

router.get('/', async (req, res) => {
  try {
    const response = await User.find();

    res.status(200).json({
      response,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
});

module.exports = router;
