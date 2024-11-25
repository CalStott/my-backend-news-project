const db = require('../db/connection');

exports.fetchAllTopics = () => {
	return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
		return rows;
	});
};

exports.fetchArticleById = (articleId) => {
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

exports.fetchArticles = () => {
	return db
		.query(
			`SELECT articles.article_id, articles.title, articles.author, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count FROM articles LEFT OUTER JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY created_at DESC;`
		)
		.then(({ rows }) => {
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
			if (rows.length === 0) {
				return Promise.reject({ status: 404, msg: 'Not found' });
			} else {
				return rows;
			}
		});
};
