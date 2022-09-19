const jwt = require('jsonwebtoken');
const { promisify} = require('util');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return res.status(201).json({
    status: true,
    token,
    data: {
      user,
    },
  });
});

exports.signin = catchAsync(async (req, res, next) => {
  // Check email & password provided

  // Check user exists with email

  // Check password correct or not

  return res.status(200).json({
    status: true,
    token,
    data: {
      user,
    },
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  // 1. Getting token and check if it's there
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError(401, "You're not logged in! Please login"));
  }

  // 2. Verificaton token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3. Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if(!currentUser) {
    return (new AppError(401, 'The user belonging to this token does no longer exist.'));
  }

  // 4. Check if user changed password after the token issued
  if(currentUser.changedPasswordAfter(decoded.iat)) {
    return (new AppError(401, 'User recently changed password! Please log in again.'));
  }

  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(403, "You don't have permission to do this action!!")
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1. Getting Ussr based on Posted email
  let user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError(404, 'There is no user with this email address'));
  }

  // 2. Generate Random Reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3. Send it to user's email

  next();
});
