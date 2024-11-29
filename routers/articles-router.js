const articlesRouter = require('express').Router();
const {
	getArticles,
	getArticleById,
	getCommentsById,
	postCommentById,
	patchArticleById,
	postArticle,
} = require('../controllers/api.controller');

articlesRouter.route('/').get(getArticles).post(postArticle);

articlesRouter
	.route('/:article_id')
	.get(getArticleById)
	.patch(patchArticleById);

articlesRouter
	.route('/:article_id/comments')
	.get(getCommentsById)
	.post(postCommentById);

module.exports = articlesRouter;
