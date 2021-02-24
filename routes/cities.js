const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/:cities', async (req, res) => {

    const cities = req.params.cities.split(',');

    console.log(cities);

    let calls = [];

    for (const city of cities) {
        const call = axios.get('http://api.openweathermap.org/data/2.5/weather', {
            params: {
                appid: '9de243494c0b295cca9337e1e96b00e2',
                q: city
            }
        });
        calls.push(call);
    }

    Promise.all(calls).then((info) => {
        let data = [];
        for (const city of info) {
            data.push({
                name: city.data.name,
                temp: city.data.main.temp,
                sunrise: city.data.sys.sunrise,
                sunset: city.data.sys.sunset,
            });
        }
        res.send(data);
    });

});

module.exports = router;