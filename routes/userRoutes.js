const express = require('express');

const authConrtoller = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authConrtoller.signup);
router.post('/signin', authConrtoller.signin);

/**
 * @TODO
 * POST/signup
 * POST/signin
 * POST/forgotPassword
 * Middleware to protect routes with auth/roles-restriction
 * GET/me
 * PATCH/updateMe
 * DELETE/deleteMe
 * 
 * NGO Admin routes - ???
 */


 
module.exports = router;