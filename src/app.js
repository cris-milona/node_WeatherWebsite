const express = require('express');
const path = require('path');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();
const port = process.env.PORT || 3000;

//paths to directories
const publicDirectory = path.join(__dirname, '../public');
const viewsDirectory = path.join(__dirname, '../templates/views');
const partialsDirectory = path.join(__dirname, '../templates/partials');

//set up handlebars engine, views and partials location
app.set('view engine', 'hbs');
app.set('views', viewsDirectory);
hbs.registerPartials(partialsDirectory);

//set up static directory
app.use(express.static(publicDirectory));

//handlers
app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather',
    name: 'Chris',
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About me',
    name: 'Chris',
  });
});

app.get('/help', (req, res) => {
  res.render('help', {
    title: 'Help',
    message: 'There is something here to help you!',
    name: 'Chris',
  });
});

//handler to communicate with the APIs
app.get('/weather', (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: 'Address must be provided',
    });
  }

  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({ error });
      }

      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return res.send({ error });
        }

        res.send({
          forecast: forecastData,
          location,
          address: req.query.address,
        });
      });
    }
  );
});

app.get('/products', (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: 'You must provide a search term',
    });
  }
  res.send({
    products: [],
  });
});

app.get('/help/*', (req, res) => {
  res.render('404', {
    title: 'Error:help page',
    name: 'Chris',
    errormessage: 'Help article not found',
  });
});

app.get('*', (req, res) => {
  res.render('404', {
    title: 'Error',
    name: 'Chris',
    errormessage: 'Page not found',
  });
});

//start the server up
app.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
