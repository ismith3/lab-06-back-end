'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');

const PORT = (process.env.PORT || 3000);
const app = express();
app.use(cors());

app.listen(PORT, () => {
  console.log('Server is listening...');
});

app.get('/location', (request, response) => {
  const location = convertToLatAndLong(request.query.data);
  response.send(location);
});

function convertToLatAndLong(query) {
  const geoData = require('./data/geo.json');
  let location = new Location(query, geoData);
  return location;
}

function Location(query, geoData) {
  this.query = query;
  this.address = geoData.results[0].formatted_address;
  this.lat = geoData.results[0].geometry.location.lat;
  this.lng = geoData.results[0].geometry.location.lng;
}
