const express = require('express');

const projectController = require('../controllers/projectController');
const ngoAuthController = require('../controllers/ngoAuthController');

const router = express.Router({mergeParams: true});

router
  .route('/')
  .get(projectController.getAllProjects)
  .post(ngoAuthController.protect, projectController.setNgosProjectsId, projectController.createProject);

router
  .route('/:id')
  .get(projectController.getProject)
  .patch(ngoAuthController.protect, projectController.updateProject)
 


module.exports = router;