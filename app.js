const express = require('express');
const app = express();

const { getApiEndpoints, getTopics } = require('./controllers/api.controller');
const { customErrorHandling } = require('./error-handling');

app.get('/api', getApiEndpoints);

app.get('/api/topics', getTopics);

app.all('*', (req, res) => {
	res.status(400).send({ msg: 'Bad request' });
});

app.use(customErrorHandling);

module.exports = app;
