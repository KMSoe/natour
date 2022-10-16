const Review = require('../models/reviewModel');
const factory = require('./handleFactory');

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createNewReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);