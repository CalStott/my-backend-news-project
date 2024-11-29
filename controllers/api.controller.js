const endpointsJson = require('../endpoints.json');
const {
	fetchAllTopics,
	fetchArticleById,
	fetchArticles,
	fetchCommentsById,
	checkArticleIdExists,
	createCommentById,
	updateArticleById,
	checkUserExists,
	removeCommentById,
	fetchUsers,
	fetchUserByUsername,
	updateCommentById,
	createArticle,
	checkTopicExists,
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
	const { sort_by, order, topic, limit, p } = req.query;
	if (topic !== undefined) {
		checkTopicExists(topic).catch(next);
	}

	fetchArticles(sort_by, order, topic, limit, p)
		.then((articles) => {
			const numOfArticles = articles.length;
			res.status(200).send({ articles, total_count: numOfArticles });
		})
		.catch(next);
};

exports.getCommentsById = (req, res, next) => {
	const { article_id } = req.params;
	const { limit, p } = req.query;

	checkArticleIdExists(article_id)
		.then(() => {
			return fetchCommentsById(article_id, limit, p);
		})
		.then((comments) => {
			res.status(200).send({ comments });
		})
		.catch(next);
};

exports.postCommentById = (req, res, next) => {
	const { article_id } = req.params;
	const newComment = req.body;

	checkArticleIdExists(article_id)
		.then(() => {
			return checkUserExists(newComment.username);
		})
		.then(() => {
			return createCommentById(article_id, newComment);
		})
		.then((comment) => {
			res.status(201).send({ comment });
		})
		.catch(next);
};

exports.patchArticleById = (req, res, next) => {
	const { article_id } = req.params;
	const { inc_votes } = req.body;
	updateArticleById(article_id, inc_votes)
		.then((article) => {
			res.status(200).send({ article });
		})
		.catch(next);
};

exports.deletesCommentById = (req, res, next) => {
	const { comment_id } = req.params;
	removeCommentById(comment_id)
		.then(() => {
			res.status(204).send();
		})
		.catch(next);
};

exports.getUsers = (req, res, next) => {
	fetchUsers()
		.then((users) => {
			res.status(200).send({ users });
		})
		.catch(next);
};

exports.getUserByUsername = (req, res, next) => {
	const { username } = req.params;
	checkUserExists(username)
		.then(() => {
			return fetchUserByUsername(username);
		})
		.then((user) => {
			res.status(200).send({ user });
		})
		.catch(next);
};

exports.patchCommentById = (req, res, next) => {
	const { comment_id } = req.params;
	const { inc_votes } = req.body;
	updateCommentById(comment_id, inc_votes)
		.then((comment) => {
			res.status(200).send({ comment });
		})
		.catch(next);
};

exports.postArticle = (req, res, next) => {
	const newArticle = req.body;
	checkUserExists(newArticle.author)
		.then(() => {
			return checkTopicExists(newArticle.topic);
		})
		.then(() => {
			return createArticle(newArticle);
		})
		.then((article) => {
			res.status(201).send({ article });
		})
		.catch(next);
};
