// routes/authRoutes.js
const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const router = express.Router();

router.get('/', authController.getLogin);
router.get('/signup', authController.getSignup);
router.post(
    '/signup',
    [
        body('username')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .normalizeEmail(),
        body('password')
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters long.')
            .trim()
            .escape(),
        body('firstname')
            .isLength({ min: 1 })
            .withMessage('First name is required')
            .trim()
            .escape(),
        body('lastname')
            .isLength({ min: 1 })
            .withMessage('Last name is required')
            .trim()
            .escape(),
    ],
    authController.postSignup
);
router.post(
    '/login',
    [
        body('username')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .normalizeEmail(),
        body('password')
            .notEmpty()
            .withMessage('Password cannot be empty.')
            .trim()
            .escape(),
    ],
    authController.postLogin
);
router.post('/logout', authController.logout);

module.exports = router;
