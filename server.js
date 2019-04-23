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

// location
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

// weather
app.get('/weather', (request, response) => {
  const weather = getWeatherData(request.query.data);
  response.send(weather);
});

function getWeatherData(query) {
  const darkSky = require('./data/darksky.json');
  let forecast = new Forecast(darkSky);
  return forecast;
}

function Forecast(darkSky) {
  this.weeklySummary = darkSky.daily.summary;
  this.data = getData(darkSky.daily.data);
}


function getData(arr) {
  let dataArray = [];

  function Day(index) {
    this.summary = arr[index].summary;
    this.date = demistify(arr[index].time);
  }

  for(let i = 0; i < arr.length; i++) {
    let currentDay = new Day(i);
    dataArray.push(currentDay);
  }
  return dataArray;
}

function demistify(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes(); 
  var sec = a.getSeconds() < 10 ? '0' + a.getSeconds() : a.getSeconds();
  var time = month + ' ' + date + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}
