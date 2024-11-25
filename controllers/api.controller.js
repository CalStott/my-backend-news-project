const endpointsJson = require('../endpoints.json');
const { findAllTopics, findArticleById } = require('../models/api.model');

exports.getApiEndpoints = (req, res) => {
	res.status(200).send({ endpoints: endpointsJson });
};

exports.getTopics = (req, res, next) => {
	findAllTopics()
		.then((topics) => {
			res.status(200).send({ topics });
		})
		.catch(next);
};

exports.getArticleById = (req, res, next) => {
	const { article_id } = req.params;
	findArticleById(article_id)
		.then((article) => {
			res.status(200).send({ article });
		})
		.catch(next);
};
