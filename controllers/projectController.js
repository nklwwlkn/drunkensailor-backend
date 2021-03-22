const Project = require('./../models/projectModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');
const userAuthController = require('./userAuthController');
const ngoAuthController = require('../controllers/ngoAuthController')
const factory = require('./handlerFactory');
const email = require('../utils/emailNotify');
const upload = require("../utils/imageUpload");

exports.uploadProjectPhoto = upload.single("images", 1);

exports.getAllProjects = factory.getAll(Project);
exports.getProject = factory.getOne(Project);
exports.updateProject = factory.updateOne(Project);
exports.deleteproject = factory.deleteOne(Project);
exports.createProject = catchAsync(async (req, res) => {
  req.body.images = [];
  if (req.file) {
    const fileName = req.file.location.split("/")[3];
    req.body.images.push(
      {
        original: `https://naida-image-bucket.s3.eu-north-1.amazonaws.com/${fileName}`,
        l: `http://naida-image-bucket.s3-website.eu-north-1.amazonaws.com/450xAUTO/${fileName}`,
        m: `http://naida-image-bucket.s3-website.eu-north-1.amazonaws.com/300xAUTO/${fileName}`,
        s: `http://naida-image-bucket.s3-website.eu-north-1.amazonaws.com/150xAUTO/${fileName}`,
        xs: `http://naida-image-bucket.s3-website.eu-north-1.amazonaws.com/100xAUTO/${fileName}`,
      }
    );
  }

  const doc = await Project.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      doc,
    },
  });
});

exports.setNgosProjectsId = (req, res, next) => {
  if (!req.body.project) req.body.project = req.params.projectId;
  if (!req.body.ngo) req.body.ngo = req.user;
  next();
};

exports.notifyUser = catchAsync(async (req, res, next) => {
  const { from, to, fromName, toName } = req.body;

  const response = await email(from, to, fromName, toName)

  res.status(200).json({
    status: "success",
    data: response
  })
})


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