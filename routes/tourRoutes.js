const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

router.get('/top-5-tours', tourController.aliasTopTours ,tourController.getAllTours);
router.route('/').get(tourController.getAllTours).post(tourController.createNewTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
