const express = require('express');

const userAuthController = require('../controllers/userAuthController');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/signup', userAuthController.signup);
router.post('/signin', userAuthController.signin);

router.use(userAuthController.protect);

router.get('/me', userController.getMe, userController.getUser);

router.patch('/updateMe', userController.updateMe);

/**
 * @TODO
 * POST/forgotPasswords
 * Middleware to protect routes with auth/roles-restriction
 * GET/me
 * PATCH/updateMe
 * DELETE/deleteMe
 * 
 * NGO Admin routes - ???
 */


 
module.exports = router;