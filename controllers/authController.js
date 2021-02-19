const crypto = require("crypto");
const jwt = require('jsonwebtoken');
const util = require('util');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const User = require('../models/userModel');



const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE_TIME
    });
  };

  const sendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
  
    const cookieOptions = {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
      httpOnly: true
    };
  
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  
    res.cookie('jwt', token, cookieOptions);
  
    user.password = undefined;
  
    res.status(statusCode).json({
      status: 'success',
      token
    });
  };

  exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      yearOfBirth: req.body.yearOfBirth,
      gender: req.body.gender,
      role: req.body.role,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      passwordChangedAt: req.body.passwordChangedAt
    });
  
   
    sendToken(newUser, 201, res);
  });

  exports.signin = catchAsync(async (req, res, next) => {
   
    const { email, password } = req.body;
  
    
    if (!email || !password) {
      return next(new AppError('Please provide a correct email and password', 400));
    }
  
 
    const user = await User.findOne({ email }).select('+password');
  
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('Incorrect email or password', 401));
    }
  
    
    sendToken(user, 200, res);
  });
  

