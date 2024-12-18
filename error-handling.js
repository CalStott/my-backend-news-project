exports.customErrorHandling = (err, req, res, next) => {
	if (err.status && err.msg) {
		res.status(err.status).send({ msg: err.msg });
	} else {
		next(err);
	}
};

exports.psqlErrorHandling = (err, req, res, next) => {
	if (err.code) {
		switch (err.code) {
			case '22P02':
			case '23502':
			case '23503':
				res.status(400).send({ msg: 'Bad request' });
				break;
		}
	} else {
		next(err);
	}
};

exports.serverErrorHandling = (err, req, res, next) => {
	res.status(500).send({ msg: 'Internal Server Error' });
};
