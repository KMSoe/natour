const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');

dotenv.config({ path: './config.env' });

const DB = process.env.DB_URL.replace('<PASSWORD>', process.env.DB_PASSWORD);

mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: true
}).then(con => {
  console.log(con.connections);
  console.log('DB connection successfully');
})

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();
app.use(express.json());
app.use(morgan('dev'));

app.use((req, res, next) => {
  req.request_at = new Date().toISOString();
  next();
});

// Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
