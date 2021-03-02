const express = require('express');

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/signin', authController.signin);

router.use(authController.protect);

router.get('/me', userController.getMe, userController.getUser);
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