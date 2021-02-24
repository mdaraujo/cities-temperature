const winston = require('winston');

module.exports = function () {

    winston.add(new winston.transports.Console({
        format: winston.format.simple(),
        level: 'debug'
    }));

    winston.exceptions.handle(
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'uncaughtExceptions.log' }));

    process.on('unhandledRejection', (ex) => {
        throw ex;
    });

}