const { body, validationResult } = require('express-validator');

exports.getMessages = (req, res) => {
    res.render('messages');
};
