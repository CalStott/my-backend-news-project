const endpointsJson = require('../endpoints.json');
const {
	fetchAllTopics,
	fetchArticleById,
	fetchArticles,
	fetchCommentsById,
	checkArticleIdExists,
} = require('../models/api.model');

exports.getApiEndpoints = (req, res) => {
	res.status(200).send({ endpoints: endpointsJson });
};

exports.getTopics = (req, res, next) => {
	fetchAllTopics()
		.then((topics) => {
			res.status(200).send({ topics });
		})
		.catch(next);
};

exports.getArticleById = (req, res, next) => {
	const { article_id } = req.params;
	fetchArticleById(article_id)
		.then((article) => {
			res.status(200).send({ article });
		})
		.catch(next);
};

exports.getArticles = (req, res, next) => {
	fetchArticles()
		.then((articles) => {
			res.status(200).send({ articles });
		})
		.catch(next);
};

exports.getCommentsById = (req, res, next) => {
	const { article_id } = req.params;
	const promises = [
		fetchCommentsById(article_id),
		checkArticleIdExists(article_id),
	];
	Promise.all(promises)
		.then(([comments]) => {
			res.status(200).send({ comments });
		})
		.catch(next);
};
