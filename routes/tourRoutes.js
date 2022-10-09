const express = require('express');
const reviewRoutes = require('./reviewRoutes');
const authController = require('../controllers/authController');
const tourController = require('../controllers/tourController');
const reviewController = require('../controllers/reviewController');

const router = express.Router();

router.use('/:tourId/reviews', reviewRoutes);
router.get('/tour-stats', tourController.getTourStats);

router.get('/top-5-tours', authController.protect, tourController.aliasTopTours ,tourController.getAllTours);
router.route('/').get(tourController.getAllTours).post(tourController.createNewTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(authController.protect, tourController.updateTour)
  .delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.deleteTour);

module.exports = router;
