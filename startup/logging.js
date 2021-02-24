const winston = require('winston');

module.exports = function () {

    winston.add(new winston.transports.Console({
        format: winston.format.simple(),
        level: 'debug'
    }));

}