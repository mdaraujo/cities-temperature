const path = require('path');
const express = require('express');
const home = require('../routes/home');

module.exports = function (app) {

    app.use('/css', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/css')));
    app.use('/', home);

}