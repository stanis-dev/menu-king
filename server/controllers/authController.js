const jwt = require('jsonwebtoken');
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
  const statusCode = req.url === '/registro' ? 201 : 200;

  // No enviar refreshToken en caso de /refresh endpoint
  if (issueRefreshToken) {
    const refreshToken = randtoken.uid(256);

    await User.findOneAndUpdate(
      { _id: user.id },
      {
        refreshToken,
        refreshTokenExpiresAt: Date.now() + 1296000000,
      }
    );

    // Enviar refreshToken, caduca en 15 días
    res.cookie('refreshToken', refreshToken, {
      expiresIn: Date.now() + 1296000000,
      signed: true,
      httpOnly: true,
      secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    });
  }

  // Enviar la respuesta. jwt caduca en 5 min
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

  // Encontrar user para token, return sin los campos especificados
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
  const refreshToken = req.signedCookies.refreshToken;

  if (!refreshToken) {
    return next(new AppError('Refresh token no encontrado', 401));
  }

  if (
    req.user.refreshToken !== refreshToken ||
    req.user.refreshTokenExpiresAt < Date.now()
  ) {
    return next(new AppError('Refresh Token caducado o incorrecto', 401));
  }

  signAndSendTokens(
    req,
    res,
    { id: req.user._id, username: req.user.username, email: req.user.email },
    false
  );
});

exports.registro = catchAsync(async (req, res, next) => {
  const { username, email, password, confirmPassword } = req.body;

  if (!username || !email || !password || !confirmPassword) {
    return next(new AppError('No se han indicado todos los campos requeridos'));
  }

  const user = await User.create({
    username,
    email,
    password,
    confirmPassword,
  });

  console.log(JSON.stringify(user));

  signAndSendTokens(req, res, {
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
  await User.findOneAndUpdate(
    { _id: req.user.id },
    { refreshToken: undefined, refreshTokenExpiresAt: undefined }
  );

  res.status(204).clearCookie('jwt').clearCookie('refreshToken').json({
    status: 'success',
    message: 'Usuario ha cerrado sesión con éxito',
  });
});
