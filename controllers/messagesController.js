const { body, validationResult } = require('express-validator');
const pool = require('../utils/db');

exports.getMessages = async (req, res) => {
    try {
        result = await pool.query(
            'SELECT messages.id, messages.text, messages.title, messages.timestamp, users.first_name AS author_name FROM messages JOIN users ON messages.user_id = users.id'
        );
        const messages = result.rows;
        const membershipStatus = req.user ? req.user.membership_status : false;
        res.render('messages', { messages, membershipStatus });
    } catch (err) {
        console.error('Error retrieving messages:', err);
        res.status(500).send('Internal Server Error');
    }
};

exports.getMembership = (req, res) => {
    res.render('membership');
};

exports.getNewMessage = (req, res) => {
    res.render('newMessage');
};

exports.postNewMessage = async (req, res) => {
    const { title, text } = req.body;
    const userId = req.user.id;

    try {
        await pool.query(
            'INSERT INTO messages (title, text, user_id) VALUES ($1, $2, $3)',
            [title, text, userId]
        );
        res.redirect('/messages');
    } catch (err) {
        console.error('error saving new msg:', err);
        res.status(500).send('Internal server error');
    }
};

exports.postMembership = async (req, res) => {
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
                message:
                    'Congratulations! You are now a member! You can view authors and post times.',
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
};

exports.postLogout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
};
