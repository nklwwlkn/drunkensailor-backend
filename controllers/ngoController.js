const Ngo = require('./../models/ngoModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};

  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    next(
      new AppError('You can not update your password here. Please do it there /updateMyPassword')
    );
  }

  const filteredBody = filterObj(req.body, 'name', 'email', "skills", "waysToMakeDifference");

  const updatedUser = await Ngo.findOneAndUpdate(req.user.id, filteredBody, {
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

exports.deleteMe = catchAsync(async (req, res, next) => {
  await Ngo.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getNgo = factory.getOne(Ngo, { path: 'projects' });
exports.getAllNgos = factory.getAll(Ngo, { path: 'projects' });
exports.updateNgo = factory.updateOne(Ngo);
exports.deleteNgo = factory.deleteOne(Ngo);

exports.createNgo = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined. Please use /signup instead.'
  });
};