const express = require('express');
const app = express();

const {
	getApiEndpoints,
	getTopics,
	getArticleById,
} = require('./controllers/api.controller');
const { customErrorHandling, psqlErrorHandling } = require('./error-handling');

app.get('/api', getApiEndpoints);

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticleById);

app.all('*', (req, res) => {
	res.status(404).send({ msg: 'Not found' });
});

app.use(customErrorHandling);

app.use(psqlErrorHandling);

module.exports = app;
