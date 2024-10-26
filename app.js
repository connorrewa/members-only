const express = require('express');
const { Pool } = require('pg');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const app = express();
const PORT = 3000;
require('dotenv').config();

const pool = new Pool({});

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(session({ secret: 'cats', resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.render('login');
});

app.get('/signup', (req, res) => {
    res.render('signUp');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
