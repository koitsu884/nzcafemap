const winston = require('winston');

module.exports = function () {
    winston.exceptions.handle(
        new winston.transports.Console({ colorize: true, pretyPrint: true}),
        new winston.transports.File({ filename: 'uncaughtExceptions.log'}),
    );

    process.on('unhandledRejection', ex => {
        throw ex;
    });

    //TODO: Turn on when needed
    winston.add(new winston.transports.File({filename: 'logfile.log'}));
}