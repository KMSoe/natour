const Tour = require('../models/tourModel');

exports.getAllTours = async (req, res) => {
  try {
    // Build Query
    const queryObj = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);

    // Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    let query = Tour.find(JSON.parse(queryStr))

    // Sorting
    if(req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Selecting Fields
    if(req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // Executing Query
    const tours = await query;

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
