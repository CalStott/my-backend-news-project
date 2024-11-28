const articlesRouter = require('express').Router();
const {
	getArticles,
	getArticleById,
	getCommentsById,
	postCommentById,
	patchArticleById,
} = require('../controllers/api.controller');

articlesRouter.get('/', getArticles);

articlesRouter
	.route('/:article_id')
	.get(getArticleById)
	.patch(patchArticleById);

articlesRouter
	.route('/:article_id/comments')
	.get(getCommentsById)
	.post(postCommentById);

module.exports = articlesRouter;
