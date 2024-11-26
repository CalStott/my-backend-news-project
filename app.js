const express = require('express');
const app = express();

const {
	getApiEndpoints,
	getTopics,
	getArticleById,
	getArticles,
	getCommentsById,
	postCommentById,
	patchArticleById,
	deletesCommentById,
	getUsers,
} = require('./controllers/api.controller');
const {
	customErrorHandling,
	psqlErrorHandling,
	serverErrorHandling,
} = require('./error-handling');

app.use(express.json());

app.get('/api', getApiEndpoints);

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticleById);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id/comments', getCommentsById);

app.get('/api/users', getUsers);

app.post('/api/articles/:article_id/comments', postCommentById);

app.patch('/api/articles/:article_id', patchArticleById);

app.delete('/api/comments/:comment_id', deletesCommentById);

app.all('*', (req, res) => {
	res.status(404).send({ msg: 'Not found' });
});

app.use(customErrorHandling);

app.use(psqlErrorHandling);

app.use(serverErrorHandling);

module.exports = app;
