const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';

  next();
};

exports.getAllTours = async (req, res) => {
  try {
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
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: 'Error',
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    return res.status(200).json({
      status: true,
      data: {
        tour,
      },
    });
  } catch (error) {
    return res.status(404).json({
      status: false,
      message: 'Not Found!!',
    });
  }
};

exports.createNewTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    return res.status(201).json({
      status: true,
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: 'Invalid Data Sent!!',
    });
  }
};

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
        $match: {  },
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
