const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const appError = require('../utils/appError');
const bcrypt = require('bcrypt');

// Funciones auxiliares
const signAndSendToken = async (req, res, next, user) => {
  try {
    const token = await jwt.sign(
      user.username,
      process.env.DATABASE_JWT_SECRET
    );

    res
      .status(201)
      .cookie('jwt', token, {
        signed: true,
        secure: process.env.NODE_ENV === 'production',
        httpOnly: process.env.NODE_ENV === 'production',
      })
      .json({
        status: 'ok',
        token,
        user,
      });
  } catch (error) {
    next(error);
  }
};

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

  // Éxito. Enviar respuesta + token
  signAndSendToken(req, res, next, user);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Comprobar si el usuario existe
  const userFound = await User.findOne({ email });

  if (!userFound) {
    return next(new appError('Los datos no son correctos', 400, true));
  }

  // Comprobar la contraseña
  const passwordIsCorrect = await bcrypt.compare(password, userFound.password);

  if (!passwordIsCorrect) {
    console.log('bcrypt fail');
    return next(new appError('Los datos no son correctos', 400, true));
  }

  signAndSendToken(req, res, next, userFound);
});
