const express = require('express');
const auth = require('../routes/auth');
const users = require('../routes/users');
const cafes = require('../routes/cafes');
const reviews = require('../routes/reviews');
const feedbacks = require('../routes/feedback');
const path = require('path');

const error = require('../middleware/error');

module.exports = function(app) {
    app.use(express.json());
    app.use('/api/auth', auth);
    app.use('/api/users', users);
    app.use('/api/cafes', cafes);
    app.use('/api/reviews', reviews);
    app.use('/api/feedbacks', feedbacks);
    //Front end
    if(process.env.NODE_ENV === 'production') {
        app.use(express.static('client/build'));
        app.get('*', (req, res) => {
            res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
        })
    }
    
    app.use(error);
}