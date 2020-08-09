const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const randtoken = require('rand-token');
const { promisify } = require('util');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const User = require('../models/userModel');

// Funciones auxiliares
exports.authenticateUser = catchAsync(async (req, res, next) => {
  const token = req.signedCookies.jwt;

  if (!token) {
    next(new AppError('Usuario no identificado', 401, true));
  }

  // Aplicamos promisify para que utilice catchAsync en caso de error
  const tokenIsValid = await promisify(jwt.verify)(
    token,
    process.env.DATABASE_JWT_SECRET,
    {
      algorithms: 'HS256',
    }
  );

  // Encontrar user para token, return con los campos especificados solamente
  const userFound = await User.findById(tokenIsValid.userId, '-password -_v');

  if (!userFound) {
    next(
      new AppError('No existe usuario relacionado con este token', 401, true)
    );
  }

  //TODO: implementar ruta cambio de contraseña
  if (userFound.passwordChangedAt > tokenIsValid.iat) {
    new AppError(
      'La contraseña del usuario ha cambiado después de emitir el token',
      401,
      true
    );
  }

  req.user = userFound;
  next();
});

exports.refresh = (req, res, next) => {
  const refreshToken = req.signedCookies.refreshToken;
  // TODO: throw error si refreshToken ha expirado, o no es correcto
};

const signAndSendToken = (req, res, user) => {
  // Firmar jwt, crear refresh token y definir el código status
  const token = jwt.sign(
    { userId: user._id },
    process.env.DATABASE_JWT_SECRET,
    {
      expiresIn: '5 min',
    }
  );
  const refreshToken = randtoken.uid(256);
  const status = req.url === '/login' ? 200 : 201;

  // Enviar la respuesta. jwt expira en 5 min, refreshToken en 15 días
  res
    .status(status)
    .cookie('jwt', token, {
      expiresIn: Date.now() + 300000,
      signed: true,
      httpOnly: true,
      secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    })
    .cookie('refreshToken', refreshToken, {
      expiresIn: Date.now() + 1296000000,
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

  signAndSendToken(req, res, userFound);
});

exports.logout = catchAsync(async (req, res, next) => {
  // TODO: identificar usuario por el token

  res.status(204).clearCookie('jwt').clearCookie('refreshToken').json({
    status: 'success',
    message: 'Usuario ha cerrado sesión con éxito',
  });
});
