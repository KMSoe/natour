const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/update-me', authController.protect, userController.updateMe);

router.post('/signup', authController.signup);
router.post('/signin', authController.signin);

router.route('/').get(userController.getAllUsers).post(userController.createNewUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

  module.exports = router;