const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

dotenv.config({ path: './config.env' });

const DB = process.env.DB_URL.replace('<PASSWORD>', process.env.DB_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
  })
  .then((con) => {
    console.log(con.connections);
    console.log('DB connection successfully');
  });

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const errHandleMiddleware = require('./controllers/ErrController');

const app = express();
app.use(express.json());
app.use(morgan('dev'));

// Global Middlewares
app.use((req, res, next) => {
  req.request_at = new Date().toISOString();
  next();
});

const limiter = rateLimit({
  max: 100,
  windowMs: 1000 * 60 * 60,
  message: 'Too many request from this IP, please try again in an hour'
});
app.use('/api', limiter);

// Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(404, `Can't find ${req.originalUrl} on the server!!`));
});

app.use(errHandleMiddleware);

module.exports = app;
