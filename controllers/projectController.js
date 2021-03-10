const Project = require('./../models/projectModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');
const userAuthController = require('./userAuthController');
const factory = require('./handlerFactory');

exports.getAllProjects = factory.getAll(Project);
exports.getProject = factory.getOne(Project);
exports.updateProject = factory.updateOne(Project);
exports.deleteproject = factory.deleteOne(Project);
exports.createProject = factory.createOne(Project);

exports.setNgosProjectsId = (req, res, next) => {
  if (!req.body.project) req.body.project = req.params.projectId;
  if (!req.body.ngo) req.body.ngo = req.user;
  next();
};


exports.getProjectsWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  console.log(latlng);
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(new AppError('Please provide correct lat and lng'), 401);
  }

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours
    }
  });
});

//!startLocation не индексируется:

exports.getProjectDistance = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(new AppError('Please provide correct lat and lng'), 401);
  }

  const distances = await Project.aggregate([
    {
      $geoNear: {
        near: { type: 'Point', coordinates: [lng * 1, lat * 1] },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      }
    },
    {
      $project: {
        distance: 1,
        name: 1
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    results: distances.length,
    data: {
      data: distances
    }
  });
});