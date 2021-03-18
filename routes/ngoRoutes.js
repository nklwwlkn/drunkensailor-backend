const express = require('express');

const ngoAuthController = require('../controllers/ngoAuthController');
//const userController = require('../controllers/userController');
const ngoController = require('../controllers/ngoController');

const router = express.Router();

router.post('/signup', ngoAuthController.signup);
router.post('/signin', ngoAuthController.signin);

router.use(ngoAuthController.protect);

router
  .route('/')
  .get(ngoController.getAllNgos)
  
router.get('/me', ngoController.getMe, ngoController.getNgo);

router.route('/:id').get(ngoController.getNgo)
/**
 * @TODO
 * POST/forgotPassword
 * Middleware to protect routes with auth/roles-restriction
 * GET/me
 * PATCH/updateMe
 * DELETE/deleteMe
 * 
 * NGO Admin routes - ???
 */


 
module.exports = router;