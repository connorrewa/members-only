// app.js
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const authRoutes = require('./routes/authRoutes');
const messagesRoutes = require('./routes/messagesRoutes');
const bcrypt = require('bcryptjs');
const app = express();
const PORT = 3000;
const pool = require('./utils/db');
require('dotenv').config();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(session({ secret: 'cats', resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const { rows } = await pool.query(
                'SELECT * FROM users WHERE email = $1',
                [username]
            );
            const user = rows[0];

            if (!user) {
                return done(null, false, { message: 'Incorrect email' });
            }
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return done(null, false, { message: 'Incorrect password' });
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [
            id,
        ]);
        const user = rows[0];

        done(null, user);
    } catch (err) {
        done(err);
    }
});

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

app.use('/', authRoutes);

app.use('/messages', messagesRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
