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
				res.status(400).send({ msg: 'Bad request' });
				break;
		}
	} else {
		console.log(err, '<-- logged err in psql err handling');
	}
};
