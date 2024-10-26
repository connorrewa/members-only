// routes/authRoutes.js
const express = require('express');
const { body } = require('express-validator');
const messagesController = require('../controllers/messagesController');
const router = express.Router();
const pool = require('../utils/db');

router.get('/', messagesController.getMessages);

router.get('/membership', messagesController.getMembership);

router.get('/new', messagesController.getNewMessage);

router.post('/new', messagesController.postNewMessage);

router.post('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

router.post('/membership', async (req, res) => {
    const userAnswer = req.body.riddleAnswer.trim().toLowerCase();
    const correctAnswer = 'piano';

    if (userAnswer == correctAnswer) {
        const userId = req.user.id;
        try {
            await pool.query(
                'UPDATE users SET membership_status = true WHERE id = $1',
                [userId]
            );
            res.render('membership', {
                message: 'Congratulations! You are now a member!',
                isMember: true,
            });
        } catch (err) {
            console.error('Error updating membership status:', err);
            res.render('membership', {
                message: 'There was an error. Please try again later.',
                isMember: false,
            });
        }
    } else {
        res.render('membership', {
            message: 'Incorrect answer. Please try again.',
            hint: 'The answer is an instrument',
            isMember: false,
        });
    }
});

module.exports = router;
