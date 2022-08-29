const express = require('express');
const authController = require('../controllers/authController');
const tourController = require('../controllers/tourController');

const router = express.Router();

router.get('/tour-stats', tourController.getTourStats);

router.get('/top-5-tours', tourController.aliasTopTours ,tourController.getAllTours);
router.route('/').get(authController.protect, tourController.getAllTours).post(tourController.createNewTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(authController.restrictTo('admin', 'lead-guide'), tourController.deleteTour);

module.exports = router;
