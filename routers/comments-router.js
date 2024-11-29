const commentsRouter = require('express').Router();
const {
	deletesCommentById,
	patchCommentById,
} = require('../controllers/api.controller');

commentsRouter
	.route('/:comment_id')
	.patch(patchCommentById)
	.delete(deletesCommentById);

module.exports = commentsRouter;
