require('dotenv').config();

const config = require('config');

module.exports = function () {
  if (!config.get('appid')) {
    throw new Error('FATAL ERROR: APPID is not defined.');
  }
}
