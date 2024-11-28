const apiRouter = require('express').Router();
const { getApiEndpoints } = require('../controllers/api.controller');
const {
	topicsRouter,
	articlesRouter,
	usersRouter,
	commentsRouter,
} = require('./router-index');

apiRouter.get('/', getApiEndpoints);

apiRouter.use('/topics', topicsRouter);

apiRouter.use('/articles', articlesRouter);

apiRouter.use('/users', usersRouter);

apiRouter.use('/comments', commentsRouter);

module.exports = apiRouter;
