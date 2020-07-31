const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const authRouter = require('./routes/authRoutes');

const { errorHandler, errorClassifier } = require('./utils/errorHandler');

const app = express();

app.enable('trust proxy');

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser('secret'));

app.use('/api/v1/users', authRouter);

app.use(errorClassifier);
app.use(errorHandler);

module.exports = app;