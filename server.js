const winston = require('winston');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
require('express-async-errors');
app.use(cors({
    exposedHeaders: ['x-auth-token'],
}));
require('./startup/logging')();
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//     extended: false,
//     type: 'application/x-www-form-urlencoded'
//   }));

require('./startup/routes')(app);
require('./startup/db')();


const port = process.env.PORT || 5000;
const server = app.listen(port, () => 
{
    const message = `Listening on port ${port}...`;
    console.log(message);
    winston.info(message);
});

module.exports = server;