const winston = require('winston');
const express = require('express');
const router = express.Router();
const axios = require('axios');
const moment = require('moment');

router.get('/:cities', async (req, res) => {

    winston.info("GET/cities/" + req.params.cities);

    const cities = req.params.cities.split(',')
        .map(city => city.trim())
        .filter(Boolean);

    let calls = [];

    for (const city of cities) {
        const call = axios.get('http://api.openweathermap.org/data/2.5/weather', {
            params: {
                appid: '9de243494c0b295cca9337e1e96b00e2',
                q: city,
                units: 'metric',
            }
        });
        calls.push(call);
    }

    let info = [];

    let allData = await Promise.all(calls);

    for (const { data } of allData) {
        info.push({
            name: data.name,
            temp: data.main.temp,
            sunrise: moment.unix(data.sys.sunrise).format("HH:mm"),
            sunset: moment.unix(data.sys.sunset).format("HH:mm"),
            country: data.sys.country,
        });
    }

    res.send(info);
});

module.exports = router;