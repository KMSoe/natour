const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';

  next();
};

exports.getAllTours = catchAsync(async (req, res) => {
  // EXECUTE QUERY
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;

  // Send Response
  return res.status(200).json({
    status: true,
    results: tours.length,
    data: {
      tours,
    },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    return  next(new AppError(404, `Tiur Not found!!`));
  }

  return res.status(200).json({
    status: true,
    data: {
      tour,
    },
  });
});

exports.createNewTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  return res.status(201).json({
    status: true,
    data: {
      tour: newTour,
    },
  });
});

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    return res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: 'Error!!',
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    return res.status(204).json({});
  } catch (error) {
    return res.status(404).json({
      status: false,
      message: 'Error!!',
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {
    const stat = await Tour.aggregate([
      {
        $match: {},
      },
      {
        $group: {
          _id: '$difficulty',
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRatings: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
    ]);

    return res.status(200).json({
      status: true,
      data: {
        stat,
      },
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: 'Error!!',
    });
  }
};
