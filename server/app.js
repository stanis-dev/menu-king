const express = require('express');
const cookieParser = require('cookie-parser');

const authRouter = require('./routes/authRoutes');
const morgan = require('morgan');

const app = express();

app.enable('trust proxy');

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

app.use('/api/v1/auth', authRouter);

module.exports = app;
