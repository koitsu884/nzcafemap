const winston = require('winston');
const express = require('express');
const config = require('config');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const error = require('./middleware/error');
const passport = require('passport');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { getClient } = require('./helper/cache');

const app = express();
require('express-async-errors');
app.use(helmet())
app.use(cors({
    exposedHeaders: ['x-auth-token'],
    credentials: true
}));

// app.use(cors({
//     credentials: true,
// }));
require('./startup/logging')();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({ 
    secret: config.get('sessionSecret'),
    name: 'id',
    store: new RedisStore({client: getClient()}),
    resave: true,
    saveUninitialized: false,
    cookie : { secure: false }
}));

// app.use(bodyParser.urlencoded({
//     extended: false,
//     type: 'application/x-www-form-urlencoded'
//   }));
require('./startup/passport')(passport);
app.use(passport.initialize());
app.use(passport.session()); 

require('./startup/routes')(app);
//Front end
if(process.env.NODE_ENV === 'production') {
// if(true) {
    app.use(express.static(path.join(__dirname, 'client/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
    })
}
app.use(error);

require('./startup/db')();


const port = process.env.PORT || 5000;
const server = app.listen(port, () => 
{
    const message = `Listening on port ${port}...`;
    console.log(message);
    winston.info(message);
});

module.exports = server;