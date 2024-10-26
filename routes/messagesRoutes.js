// routes/authRoutes.js
const express = require('express');
const { body } = require('express-validator');
const messagesController = require('../controllers/messagesController');
const router = express.Router();
const isAuthenticated = require('../middleware/auth');

router.get('/', isAuthenticated, messagesController.getMessages);

router.post('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

module.exports = router;
