// controllers/authController.js
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const pool = require('../utils/db'); // Adjust this path to where your Pool is defined

exports.getLogin = (req, res) => {
    res.render('login', { error: null, errors: null });
};

exports.getSignup = (req, res) => {
    res.render('signUp', { error: null, errors: null });
};

exports.postSignup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('signUp', {
            error: null,
            errors: errors.array(),
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const { firstname, lastname } = req.body;
        const { rows } = await pool.query(
            'INSERT INTO users (email, password, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING *',
            [req.body.username, hashedPassword, firstname, lastname]
        );

        const newUser = rows[0];

        req.logIn(newUser, (err) => {
            if (err) {
                return next(err);
            }
            return res.redirect('/messages');
        });
    } catch (err) {
        return next(err);
    }
};

exports.postLogin = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('login', { error: null, errors: errors.array() });
    }

    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.render('login', {
                error: 'Invalid email or password.',
                errors: null,
            });
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.redirect('/messages');
        });
    })(req, res, next);
};

exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
};
