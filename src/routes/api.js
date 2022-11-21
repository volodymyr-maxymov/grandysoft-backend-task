const express = require('express');

const usersRouter = require('./users/users.router');
const { httpGetNUsersWithMaxCountOfSubscriptions,
	httpGetAllUsersWithNoSubscriptions } = require("./users/users.controller");

const api = express.Router();

api.use('/users', usersRouter);
api.get('/max-following', httpGetNUsersWithMaxCountOfSubscriptions);
api.get('/not-following', httpGetAllUsersWithNoSubscriptions);

module.exports = api;
