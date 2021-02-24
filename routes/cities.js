const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/:city', async (req, res) => {

    const { data } = await axios.get('http://api.openweathermap.org/data/2.5/weather', {
        params: {
            appid: '9de243494c0b295cca9337e1e96b00e2',
            q: req.params.city
        }
    });

    let info = {
        name: data.name,
        temp: data.main.temp,
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset,
    }

    res.send(info);
});

module.exports = router;