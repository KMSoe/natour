const express = require('express');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

const router = express.Router();

router.route('/')
    .get(authController.protect, reviewController.getAllReviews)
    .post(authController.protect, reviewController.createNewReview);

router
    .route('/:id')
    .get(reviewController.getReview)

module.exports = router;
