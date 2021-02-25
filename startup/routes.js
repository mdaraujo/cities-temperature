const path = require('path');
const express = require('express');
const error = require('../middleware/error');
const home = require('../routes/home');
const cities = require('../routes/cities');

module.exports = function (app) {

    app.use('/css', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/css')));
    app.use('/js', express.static(path.join(__dirname, '../node_modules/axios/dist')));
    app.use('/js', express.static(path.join(__dirname, '../node_modules/jquery/dist')));
    app.use('/js', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/js')));

    app.use(express.json());
    app.use('/', home);
    app.use('/cities', cities);

    app.use(error);
}