const express = require('express');
const router = express.Router();
const winston = require('winston');
const config = require('config');
const axios = require('axios');
const moment = require('moment');

let cache = new Map();

router.get('/:cities', async (req, res) => {

    winston.info("GET   /cities/" + req.params.cities);

    const citiesNames = new Set(req.params.cities.split(',')
        .map(city => city.trim())
        .filter(Boolean));

    let citiesInfo = new Map();
    let externalCalls = [];

    for (const cityName of citiesNames) {
        if (cache.has(cityName)) {
            const cacheCity = cache.get(cityName);
            if (moment(cacheCity.cacheMoment).isAfter(moment().subtract(config.get('cacheMinutes'), 'minutes'))) {
                let city = { ...cacheCity };
                delete city.cacheMoment;
                citiesInfo.set(cityName, city);
                continue;
            }
        }

        const call = axios.get('http://api.openweathermap.org/data/2.5/weather', {
            params: {
                appid: config.get('appid'),
                q: cityName,
                units: 'metric',
            }
        });
        externalCalls.push(call);
    }

    let allResults = await Promise.allSettled(externalCalls);

    for (const result of allResults) {

        if (result.status === "rejected") {
            const cityName = result.reason.config.params.q;
            citiesInfo.set(cityName, {
                name: cityName,
                valid: false
            });
            winston.debug("New rejected request for city: " + cityName);
            continue;
        }

        const { data } = result.value;

        const city = {
            name: data.name,
            temp: data.main.temp,
            sunrise: moment.unix(data.sys.sunrise).format("HH:mm"),
            sunset: moment.unix(data.sys.sunset).format("HH:mm"),
            country: data.sys.country,
            valid: true
        }

        citiesInfo.set(city.name, city);

        const cityCache = { ...city, cacheMoment: moment.now() };

        cache.set(city.name, cityCache);

        winston.debug("New valid request for city: " + city.name);
    }

    res.send(Array.from(citiesInfo.values()));
});

module.exports = router;