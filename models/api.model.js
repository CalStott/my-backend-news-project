const db = require('../db/connection');

exports.fetchAllTopics = () => {
	return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
		return rows;
	});
};

exports.fetchArticleById = (articleId) => {
	return db
		.query(
			`SELECT articles.*, CAST(COUNT(comments.article_id) AS INT) AS comment_count FROM articles LEFT OUTER JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;`,
			[articleId]
		)
		.then(({ rows }) => {
			if (rows.length === 0) {
				return Promise.reject({ status: 404, msg: 'Not found' });
			} else {
				return rows[0];
			}
		});
};

exports.fetchArticles = (
	sort_by = 'created_at',
	order = 'desc',
	topic,
	validTopics
) => {
	const validSortValues = [
		'article_id',
		'title',
		'topic',
		'author',
		'created_at',
		'votes',
	];
	const validOrderValues = ['ASC', 'DESC'];
	const uppercaseOrder = order.toUpperCase();

	let queryStr = `SELECT articles.article_id, articles.title, articles.author, articles.topic, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.article_id) AS int) AS comment_count FROM articles LEFT OUTER JOIN comments ON comments.article_id = articles.article_id `;
	const queryValues = [];

	if (
		!validSortValues.includes(sort_by) ||
		!validOrderValues.includes(uppercaseOrder)
	) {
		return Promise.reject({ status: 400, msg: 'Bad request' });
	}

	if (topic) {
		if (!validTopics.includes(topic)) {
			return Promise.reject({ status: 404, msg: 'Not found' });
		}
		queryStr += `WHERE articles.topic = $1 `;
		queryValues.push(topic);
	}

	queryStr += `GROUP BY articles.article_id `;
	queryStr += `ORDER BY articles.${sort_by} ${uppercaseOrder};`;

	return db.query(queryStr, queryValues).then(({ rows }) => {
		return rows;
	});
};

exports.fetchCommentsById = (articleId) => {
	return db
		.query(
			`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`,
			[articleId]
		)
		.then(({ rows }) => {
			return rows;
		});
};

exports.checkArticleIdExists = (article_id) => {
	return db
		.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
		.then(({ rows }) => {
			if (!rows.length) {
				return Promise.reject({ status: 404, msg: 'Not found' });
			}
		});
};

exports.checkUserExists = (username) => {
	return db
		.query(`SELECT * FROM users WHERE username = $1;`, [username])
		.then(({ rows }) => {
			if (!rows.length) {
				return Promise.reject({ status: 404, msg: 'Not found' });
			}
		});
};

exports.createCommentById = (article_id, comment) => {
	const { username, body } = comment;
	return db
		.query(
			`INSERT INTO comments(article_id, author, body) VALUES ($1, $2, $3) RETURNING *;`,
			[article_id, username, body]
		)
		.then(({ rows }) => {
			return rows[0];
		});
};

exports.updateArticleById = (articleId, updatedInfo) => {
	return db
		.query(
			`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
			[updatedInfo, articleId]
		)
		.then(({ rows }) => {
			if (rows.length === 0) {
				return Promise.reject({ status: 404, msg: 'Not found' });
			}
			return rows[0];
		});
};

exports.removeCommentById = (commentId) => {
	return db
		.query(` DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [
			commentId,
		])
		.then(({ rows }) => {
			if (rows.length === 0) {
				return Promise.reject({ status: 404, msg: 'Not found' });
			}
		});
};

exports.fetchUsers = () => {
	return db.query(`SELECT * FROM users;`).then(({ rows }) => {
		return rows;
	});
};

exports.fetchUserByUsername = (inputUsername) => {
	return db
		.query(`SELECT * FROM users WHERE username = $1;`, [inputUsername])
		.then(({ rows }) => {
			return rows[0];
		});
};
