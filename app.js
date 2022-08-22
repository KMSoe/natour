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

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: ['true', 'A tour have a name'],
    unique: true
  },
  rating: {
    type: Number,
    default: 4.3
  },
  price: {
    type: Number,
    required: ['true', 'A tour have a price'],
  }
});

const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
  name: 'The Forest Hiker',
  rating: 4.5,
});

Tour.find().then(res => {
  console.log(res)
}).catch(err => console.log('Error'))

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
