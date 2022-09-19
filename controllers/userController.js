const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};


exports.getAllUsers = (req, res) => {
    res.status(500).json({
        status: false,
        'error': 'Somethong Went Wrong!!!',
    });
}

exports.getUser = (req, res) => {
    res.status(500).json({
        status: false,
        'error': 'Somethong Went Wrong!!!',
    });
}

exports.createNewUser = (req, res) => {
    res.status(500).json({
        status: false,
        'error': 'Somethong Went Wrong!!!',
    });
}

exports.updateUser = (req, res) => {
    res.status(500).json({
        status: false,
        'error': 'Somethong Went Wrong!!!',
    });
}

exports.updateMe = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError(400,
                'This route is not for password updates. Please use /updateMyPassword.'
            )
        );
    }

    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email');

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});

exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: false,
        'error': 'Somethong Went Wrong!!!',
    });
}