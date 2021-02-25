const express = require('express');
const router = express.Router();
const winston = require('winston');
const config = require('config');
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
                appid: config.get('appid'),
                q: city,
                units: 'metric',
            }
        });
        calls.push(call);
    }

    let info = [];

    let allResults = await Promise.allSettled(calls);

    for (const result of allResults) {

        if (result.status === "rejected") {
            info.push({
                name: result.reason.config.params.q
            });
            continue;
        }

        const { data } = result.value;

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