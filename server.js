const winston = require('winston');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const error = require('./middleware/error');
const bodyParser = require('body-parser');

const app = express();
require('express-async-errors');
app.use(helmet())
// app.use(cors({
//     exposedHeaders: ['x-auth-token'],
// }));
require('./startup/logging')();
app.use(bodyParser.json());

// app.use(bodyParser.urlencoded({
//     extended: false,
//     type: 'application/x-www-form-urlencoded'
//   }));

require('./startup/routes')(app);
//Front end
if(process.env.NODE_ENV === 'production') {
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