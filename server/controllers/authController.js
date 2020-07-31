const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');

/* 
TODO Abstraer lógica de JWT a función externa
TODO Implementar comporobación expiración JWT
*/
exports.registro = catchAsync(async (req, res, next) => {
  const { username, email, password, confirmPassword } = req.body;

  const user = await User.create({
    username,
    email,
    password,
    confirmPassword,
  });

  // Implementación JWT
  const token = await jwt.sign(username, process.env.DATABASE_JWT_SECRET);

  res.cookie('Bearer Token', token, {
    signed: true,
    secure: process.env.NODE_ENV === 'production',
    httpOnly: process.env.NODE_ENV === 'production',
  });

  res.status(201).json({
    status: 'ok',
    user,
  });
});

exports.login = catchAsync(async (req, res, next) => {});
