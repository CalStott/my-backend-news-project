const db = require('../db/connection');

exports.findAllTopics = () => {
	return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
		return rows;
	});
};

exports.findArticleById = (articleId) => {
	return db
		.query(`SELECT * FROM articles WHERE article_id = $1;`, [articleId])
		.then(({ rows }) => {
			if (rows.length === 0) {
				return Promise.reject({ status: 404, msg: 'Not found' });
			} else {
				return rows[0];
			}
		});
};
