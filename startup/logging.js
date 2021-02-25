const winston = require('winston');
require('express-async-errors');

module.exports = function () {

    winston.add(new winston.transports.Console({
        format: winston.format.simple(),
        level: 'debug'
    }));

    winston.add(new winston.transports.File({
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
        ),
        filename: 'info.log',
        level: 'info'
    }));

    winston.exceptions.handle(
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'uncaughtExceptions.log' }));

    process.on('unhandledRejection', (ex) => {
        throw ex;
    });

}