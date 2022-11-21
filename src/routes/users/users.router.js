const express = require('express');

const { httpGetAllUsers,
	httpGetAllUsersFriends } = require('./users.controller');

const usersRouter = express.Router();

usersRouter.get('/', httpGetAllUsers);
usersRouter.get('/:id/friends', httpGetAllUsersFriends);

module.exports = usersRouter;
