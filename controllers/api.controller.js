const endpointsJson = require('../endpoints.json');

exports.getApiEndpoints = (req, res) => {
	return res.status(200).send({ endpoints: endpointsJson });
};
