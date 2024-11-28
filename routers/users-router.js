const usersRouter = require('express').Router();
const { getUsers } = require('../controllers/api.controller');

usersRouter.get('/', getUsers);

module.exports = usersRouter;
