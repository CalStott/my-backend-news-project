const endpointsJson = require('../endpoints.json');
const { findAllTopics } = require('../models/api.model');

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
