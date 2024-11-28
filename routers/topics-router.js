const topicsRouter = require('express').Router();
const { getTopics } = require('../controllers/api.controller');

topicsRouter.get('/', getTopics);

module.exports = topicsRouter;
