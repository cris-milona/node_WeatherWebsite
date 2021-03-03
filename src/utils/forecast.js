const request = require('request');

const forecast = (latitude, longitude, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=6b52c66d933eb7adc0fa0da43205bda7&query=${latitude},${longitude}`;

  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback('Unable to connect to weather service!', undefined);
    } else if (body.error) {
      console.log(body.error);
      callback('Unable to find location', undefined);
    } else {
      callback(
        undefined,
        `The temperature is ${body.current.temperature} degrees of celsius but it feels like ${body.current.feelslike}. \n There is ${body.current.precip}% chance of raining and the wind direction will be ${body.current.wind_dir}`
      );
    }
  });
};

module.exports = forecast;
