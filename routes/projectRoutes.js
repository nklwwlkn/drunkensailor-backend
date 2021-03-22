const express = require('express');

const projectController = require('../controllers/projectController');
const ngoAuthController = require('../controllers/ngoAuthController');

const router = express.Router({mergeParams: true});

router
  .route('/')
  .get(projectController.getAllProjects)
  .post(ngoAuthController.protect, projectController.uploadProjectPhoto, projectController.setNgosProjectsId, projectController.createProject);

router.route('/notify').post(ngoAuthController.protect, projectController.notifyUser)


router
  .route('/:id')
  .get(projectController.getProject)
  .patch(ngoAuthController.protect, projectController.updateProject)
 


module.exports = router;