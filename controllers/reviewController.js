const Review = require('../models/reviewModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');



exports.getAllReviews = catchAsync(async (req, res) => {
  // EXECUTE QUERY
  const features = new APIFeatures(Review.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const reviews = await features.query;

  // Send Response
  return res.status(200).json({
    status: true,
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.getReview = catchAsync(async (req, res, next) => {
    const review = await Tour.findById(req.params.id).populate({
        path: "user",
        select: "name"
      }).populate({
        path: "tour",
        select: "name"
      });
    
      if (!review) {
        return  next(new AppError(404, `Review Not found!!`));
      }
    
      return res.status(200).json({
        status: true,
        data: {
          review,
        },
      });
});

exports.createNewReview = catchAsync(async (req, res, next) => {
  const newReview = await Review.create(req.body);

  return res.status(201).json({
    status: true,
    data: {
      review: newReview,
    },
  });
});