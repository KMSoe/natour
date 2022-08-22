const Tour = require('../models/tourModel');

exports.checkID = (req, res, next, val) => {
  console.log(`Tour id is: ${val}`);

  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
};

exports.getAllTours = async (req, res) => {
  const tours = await Tour.find();

  res.status(200).json({
    status: true,
    request_at: req.request_at,
    data: {
      tours,
    },
  });
};

exports.getTour = (req, res) => {
  const id = req.params.id * 1;

  const tour = Tour.find(id);

  res.status(200).json({
    status: true,
    data: {
      tour,
    },
  });
};

exports.createNewTour = async (req, res) => {
  const tour = new Tour({

  });

  const result = await tour.save();

  res.status(201).json({
    status: true,
    data: {
      result,
    },
  })

};

exports.updateTour = (req, res) => {
  //   console.log(req.params);

  res.status(200).json({
    status: 'success',
    data: {
      tour: `<Updated tour-id ${req.params.id} here...>`,
    },
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
