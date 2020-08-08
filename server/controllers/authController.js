const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const randtoken = require('rand-token');

const catchAsync = require('../utils/catchAsync');
const appError = require('../utils/appError');

const User = require('../models/userModel');

// Funciones auxiliares
const signAndSendToken = (req, res, next, user) => {
  const token = jwt.sign(
    { userId: user._id },
    process.env.DATABASE_JWT_SECRET,
    {
      expiresIn: '5 min',
    }
  );
  const refreshToken = randtoken.uid(256);
  const status = req.url === '/login' ? 200 : 201;

  res
    .status(status)
    .cookie('jwt', token, {
      signed: true,
      httpOnly: true,
      secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    })
    .cookie('refreshToken', refreshToken, {
      signed: true,
      httpOnly: true,
      secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    })
    .json({
      status: 'success',
      user,
    });
};

/* 
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
    return next(new appError('Los datos no son correctos', 401, true));
  }

  // Comprobar la contraseña
  const passwordIsCorrect = await bcrypt.compare(password, userFound.password);

  if (!passwordIsCorrect) {
    return next(new appError('Los datos no son correctos', 401, true));
  }

  signAndSendToken(req, res, next, userFound);
});
