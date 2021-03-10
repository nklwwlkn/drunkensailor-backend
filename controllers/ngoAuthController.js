const crypto = require("crypto");
const jwt = require('jsonwebtoken');
const util = require('util');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const Ngo = require('../models/ngoModel');



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
    const {name, email, description, websiteUrl, supportedCauses, photos, password, passwordConfirm } = req.body

    const newNgo = await Ngo.create({
      name,
      email,
      description,
      websiteUrl,
      supportedCauses,
      photos,
      password,
      passwordConfirm
    });
  
    sendToken(newNgo, 201, res);
  });

  exports.signin = catchAsync(async (req, res, next) => {
   
    const { email, password } = req.body;
  
    
    if (!email || !password) {
      return next(new AppError('Please provide a correct email and password', 400));
    }
  
 
    const ngo = await Ngo.findOne({ email }).select('+password');
  
    if (!ngo || !(await ngo.correctPassword(password, ngo.password))) {
      return next(new AppError('Incorrect email or password', 401));
    }
  
    
    sendToken(ngo, 200, res);
  });

  exports.protect = catchAsync(async (req, res, next) => {
    let token;
  
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
  
    if (!token) {
      return next(new AppError('You are not logged in. Please login to access'));
    }
  
    const decoded = await util.promisify(jwt.verify)(token, process.env.JWT_SECRET);
  
    const currentUser = await Ngo.findById(decoded.id);
  
    if (!currentUser) {
      return next(new AppError('The user with this token does not exist', 401));
    }
  
    if (currentUser.isPasswordChanged(decoded.iat)) {
      return next(new AppError('Password has been changed, please log in', 401));
    }
  
    req.user = currentUser;
    next();
  });
  
  exports.restrictTo = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(new AppError('You do not have permission to perform this action'), 403);
      }
      next();
    };
  };
  

