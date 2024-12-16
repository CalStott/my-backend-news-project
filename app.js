const express = require('express');
const app = express();
const cors = require('cors');

const {
	customErrorHandling,
	psqlErrorHandling,
	serverErrorHandling,
} = require('./error-handling');

const apiRouter = require('./routers/api-router');

app.use(cors());

app.use(express.json());

app.use('/api', apiRouter);

app.all('*', (req, res) => {
	res.status(404).send({ msg: 'Not found' });
});

app.use(customErrorHandling);

app.use(psqlErrorHandling);

app.use(serverErrorHandling);

module.exports = app;
