const express = require('express');
const app = express();

const { getApiEndpoints } = require('./controllers/api.controller');

app.get('/api', getApiEndpoints);

module.exports = app;
