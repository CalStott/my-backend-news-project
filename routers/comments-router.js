const commentsRouter = require('express').Router();
const { deletesCommentById } = require('../controllers/api.controller');

commentsRouter.route('/:comment_id').delete(deletesCommentById);

module.exports = commentsRouter;
