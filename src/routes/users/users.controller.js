const { getAllUsersAndTheirSubscriptions,
	getAllUsersFriends,
	getNUsersWithMaxCountOfSubscriptions,
	getAllUsersWithNoSubscriptions,
	getUser } = require('../../models/users.model');

async function httpGetAllUsers(req, res) {
	const allUsersAndTheirSubscriptions = await getAllUsersAndTheirSubscriptions();
	const allUsers = groupUsersAndTheirSubscriptionsByUser(allUsersAndTheirSubscriptions);

	return res.status(200).json(allUsers);
}

function groupUsersAndTheirSubscriptionsByUser(usersAndTheirSubscriptions) {
	let usersAndTheirSubscriptionsGroupedByUser = [];
	let previousUser = null;

	function isTheSameUser(user, userToCompareWith) {
		return user.id === userToCompareWith.usr_id;
	}

	function createUserWithSubscriptionsArray(userAndSubscription) {
		const user = {
			id: userAndSubscription.usr_id,
			name: userAndSubscription.usr_name,
			gender: userAndSubscription.usr_gender
		};

		addSubscriptionToUser(user, userAndSubscription);

		return user;
	}

	function addSubscriptionToUser(user, subscription) {
		if (!user.subscriptions) {
			user.subscriptions = [];
		}

		user.subscriptions.push({
			id: subscription.subscr_id,
			name: subscription.subscr_name,
			gender: subscription.subscr_gender
		});
	}

	for (const userAndSubscription of usersAndTheirSubscriptions) {
		if (previousUser && isTheSameUser(previousUser, userAndSubscription)) {
			addSubscriptionToUser(previousUser, userAndSubscription);
		} else {
			previousUser = createUserWithSubscriptionsArray(userAndSubscription);
			usersAndTheirSubscriptionsGroupedByUser.push(previousUser);
		}
	}

	return usersAndTheirSubscriptionsGroupedByUser;
}

async function httpGetAllUsersFriends(req, res) {
	const userId = Number(req.params.id);

	if (isNaN(userId) || !(await checkWhetherUserWithThisIdExists(userId))) {
		return res.status(404).json({
			error: 'User not found',
		});
	}

	const defaultOrderBy = 'id';
	const orderBy = isOrderByQueryParameterValid(req.query.order_by) ? req.query.order_by : defaultOrderBy;
	const orderAscending = (req.query.order_type === 'asc');

	const allUsersFriends = await getAllUsersFriends(userId, orderBy, orderAscending);

	return res.status(200).json(allUsersFriends);
}

async function checkWhetherUserWithThisIdExists (userId) {
	const user = await getUser(userId);
	return user.length === 1;
}

function isOrderByQueryParameterValid(orderBy) {
	return (['id', 'name', 'gender'].findIndex(el => el === orderBy) !== -1);
}

async function httpGetNUsersWithMaxCountOfSubscriptions(req, res) {
	const n = 5;

	const nUsersWithMaxCountOfSubscriptions = await getNUsersWithMaxCountOfSubscriptions(n);

	return res.status(200).json(nUsersWithMaxCountOfSubscriptions);
}

async function httpGetAllUsersWithNoSubscriptions(req, res) {
	const allUsersWithNoSubscriptions = await getAllUsersWithNoSubscriptions();

	return res.status(200).json(allUsersWithNoSubscriptions);
}

module.exports = {
	httpGetAllUsers,
	httpGetAllUsersFriends,
	httpGetNUsersWithMaxCountOfSubscriptions,
	httpGetAllUsersWithNoSubscriptions
}
