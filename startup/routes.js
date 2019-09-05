const express = require('express');
const auth = require('../routes/auth');
const users = require('../routes/users');
const cafes = require('../routes/cafes');
const reviews = require('../routes/reviews');
const feedbacks = require('../routes/feedback');


const error = require('../middleware/error');

module.exports = function(app) {
    app.use(express.json());
    app.use('/api/auth', auth);
    app.use('/api/users', users);
    app.use('/api/cafes', cafes);
    app.use('/api/reviews', reviews);
    app.use('/api/feedbacks', feedbacks);
    app.use(error);
}