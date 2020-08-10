const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const randtoken = require('rand-token');
const { promisify } = require('util');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const User = require('../models/userModel');

// Funciones auxiliares
const signAndSendTokens = async (req, res, user, issueRefreshToken = true) => {
  // Firmar jwt, crear refresh token y definir el código status
  const token = jwt.sign({ userId: user.id }, process.env.DATABASE_JWT_SECRET, {
    expiresIn: '5 min',
  });
  const statusCode = req.url === '/signup' ? 201 : 200;

  if (issueRefreshToken) {
    const refreshToken = randtoken.uid(256);

    await User.findOneAndUpdate(
      { _id: user.id },
      {
        refreshToken,
        refreshTokenExpiresAt: Date.now() + 1296000000,
      }
    );

    res.cookie('refreshToken', refreshToken, {
      expiresIn: Date.now() + 1296000000,
      signed: true,
      httpOnly: true,
      secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    });
  }

  // Enviar la respuesta. jwt expira en 5 min, refreshToken en 15 días
  res
    .status(statusCode)
    .cookie('jwt', token, {
      expiresIn: Date.now() + 300000,
      signed: true,
      httpOnly: true,
      secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    })
    .json({
      status: 'success',
      user,
    });
};

exports.authenticateUser = catchAsync(async (req, res, next) => {
  const token = req.signedCookies.jwt;

  if (!token) {
    return next(new AppError('Usuario no identificado', 401));
  }

  // Aplicamos promisify para que utilice catchAsync en caso de error
  const validatedToken = await promisify(jwt.verify)(
    token,
    process.env.DATABASE_JWT_SECRET,
    {
      algorithms: 'HS256',
    }
  );

  // Encontrar user para token, return con los campos especificados solamente
  const userFound = await User.findById(validatedToken.userId, '-password -_v');

  if (!userFound) {
    next(new AppError('No existe usuario relacionado con este token', 401));
  }

  //TODO: implementar ruta cambio de contraseña
  if (userFound.passwordChangedAt > validatedToken.iat) {
    new AppError(
      'La contraseña del usuario ha cambiado después de emitir el token',
      401
    );
  }

  req.user = userFound;
  next();
});

exports.refresh = catchAsync(async (req, res, next) => {
  const token = req.signedCookies.jwt;
  const refreshToken = req.signedCookies.refreshToken;

  if (!token || !refreshToken) {
    return next(new AppError('Usuario no identificado', 401));
  }

  const validateToken = await promisify(jwt.verify)(
    token,
    process.env.DATABASE_JWT_SECRET,
    {
      algorithms: 'HS256',
      ignoreExpiration: true,
    }
  );
  /* 
jwt=s%3AeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZjIzNDUwODliMzJkNTNkZDQyZWM4YmYiLCJpYXQiOjE1OTcwNTMxMzQsImV4cCI6MTU5NzA1MzQzNH0.ICaugZXpt4VBYwHyS6vxDvqthDzZ9kSx63ycks5SbN0.u%2BXvCwbmw3xTvYRRfLXl3QTmaBzjjWg4qxkgJWioEEI; Path=/; Domain=localhost; HttpOnly;
refreshToken=s%3A6QwXFvuo6Sa3apumm2AEVpM4BfUy3OfWaFOTeT1Qq9K9NR6xUpA5yqXGJInMjXp01yoAbKMhs08uPrg3G6ZPUYDr7dmxK3Gp75vQyNziNcpwv9c71LZjoatApdkVO4XrhKcYXNcWrtqTeujzZinVN4f5r0ttGIcGglCidcRyBrPLa1AXvRhKPjSsDWCLWoDr06GvahoOVY0LcXcTEhu82Mgn9oMtaEOzfsUG8pKOHxpNCq9mshz6guv0jZJexh45.k6d6j5MStPq6%2FbR0U%2Fu4wwjJq7GiQRJ%2Bw8XjltMn8g0; Path=/; Domain=localhost; HttpOnly;
jwt=s%3AeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZjIzNDUwODliMzJkNTNkZDQyZWM4YmYiLCJpYXQiOjE1OTcwNTMxOTcsImV4cCI6MTU5NzA1MzQ5N30.vKWmag1ExLRqwxd4KVuajYe6Nj6xZQhvbT4worDpRTc.IxclhJq%2FSt80i7L5z1Nd0CmCNL11st4PmyHUGvDNHB4; Path=/; Domain=localhost; HttpOnly;
refreshToken=s%3ALBzd0HAnjFpcloaIdaHxcC03ZpiOH9gyCG9xpvaqCGylUerrrekjG727GoVLOeqyoZbMaeLooKdHM0kEhfa3brIdCUBgOAkdgHFwn9Yw2860piqInkpwCOh3gwzF4cqBTWdrwGNYlZLTRF7vvUi44d6Qj6uYat4lNrvYZI1GA2hrFjx6GO0jkwjg6kMq0JhR4TcX3unEU6K5xJmIt1grTVfARHXRVjvNMrblKJcRu4XIJqG0lrdXAmTLkPZGxp7c.7zxk8jjKsiPRoCdoRkVqyHNQIqtDre84x03QmStPFo4; Path=/; Domain=localhost; HttpOnly;
*/
  const userFound = await User.findById(validateToken.userId);

  if (!userFound) {
    return next(
      new AppError('No existe usuario relacionado con este token', 401)
    );
  }

  if (
    userFound.refreshToken !== refreshToken ||
    userFound.refreshTokenExpiresAt < Date.now()
  ) {
    return next(new AppError('Refresh Token caducado o incorrecto', 401));
  }

  signAndSendTokens(req, res, userFound, false);
});

/* 
TODO Implementar comporobación expiración JWT
*/
exports.registro = catchAsync(async (req, res, next) => {
  const { username, email, password, confirmPassword } = req.body;

  const user = await User.create(
    {
      username,
      email,
      password,
      confirmPassword,
    },
    { select: '_id username email' }
  );

  // Éxito. Enviar respuesta + token
  signAndSendTokens(req, res, next, {
    id: user._id,
    username: user.username,
    email: user.email,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new AppError('El email o la contaseña no se han indicado', 401)
    );
  }

  // Comprobar si el usuario existe
  const userFound = await User.findOne({ email }).select('+password');

  if (!userFound) {
    return next(new AppError('Los datos no son correctos', 401));
  }

  const passwordIsCorrect = await userFound.checkPassword(
    password,
    userFound.password
  );

  if (!passwordIsCorrect) {
    return next(new AppError('Los datos no son correctos', 401));
  }

  signAndSendTokens(req, res, {
    id: userFound._id,
    username: userFound.username,
    email: userFound.email,
  });
});

exports.logout = catchAsync(async (req, res, next) => {
  // TODO: identificar usuario por el token

  res.status(204).clearCookie('jwt').clearCookie('refreshToken').json({
    status: 'success',
    message: 'Usuario ha cerrado sesión con éxito',
  });
});
