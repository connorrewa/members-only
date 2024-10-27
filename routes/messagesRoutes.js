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

router.post('/membership', messagesController.postMembership);

module.exports = router;
