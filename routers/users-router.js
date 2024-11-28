const usersRouter = require('express').Router();
const {
	getUsers,
	getUserByUsername,
} = require('../controllers/api.controller');

usersRouter.get('/', getUsers);

usersRouter.get('/:username', getUserByUsername);

module.exports = usersRouter;
