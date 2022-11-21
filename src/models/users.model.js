const mysql = require('mysql2/promise');

const { getDBConnection } = require('../services/mysql');

async function getAllUsersAndTheirSubscriptions() {
	const connection  = getDBConnection();

	const query = `SELECT 
	usr.id AS usr_id, 
	usr.\`name\` AS usr_name, 
	usr.gender AS usr_gender, 
	subscr_usr.id AS subscr_id, 
	subscr_usr.\`name\` AS subscr_name, 
	subscr_usr.gender AS subscr_gender
	FROM \`users\` AS usr 
	LEFT JOIN \`subscriptions\` AS subscr 
	ON usr.id = subscr.uid1
	LEFT JOIN \`users\` AS subscr_usr
	ON subscr.uid2 = subscr_usr.id
	ORDER BY usr.id ASC`;

	const [rows, fields] = await connection.query(query);

	return rows;
}

async function getAllUsersFriends(userID, orderBy, orderAscending) {
	const connection = getDBConnection();

	const preparedQuery = `SELECT friend.id, friend.\`name\`, friend.gender 
	FROM \`subscriptions\` AS subscr1
	LEFT JOIN \`subscriptions\` AS subscr2
	ON subscr1.uid2 = subscr2.uid1 AND subscr2.uid2 = subscr1.uid1
	LEFT JOIN \`users\` AS friend
	ON subscr2.uid1 = friend.id
	WHERE subscr1.uid1 = ? AND subscr2.uid1 IS NOT NULL
	ORDER BY friend.\`${orderBy}\` ${orderAscending ? 'ASC' : 'DESC'}`;

	const [rows, fields] = await connection.query(preparedQuery, [userID]);

	return rows;
}

async function getUser(userID) {
	const connection = getDBConnection();

	const preparedQuery = `SELECT *
	FROM \`users\` AS usr
	WHERE usr.id = ?`;

	const [rows, fields] = await connection.query(preparedQuery, [userID]);

	return rows;
}

async function getNUsersWithMaxCountOfSubscriptions(n) {
	const connection = getDBConnection();

	const preparedQuery = `SELECT usr.id, usr.name, usr.gender, COUNT(*) AS subscr_count
	FROM \`subscriptions\` AS subscr
	LEFT JOIN \`users\` AS usr
	ON subscr.uid1 = usr.id
	GROUP BY subscr.uid1
	ORDER BY subscr_count DESC
	LIMIT ?`;

	const [rows, fields] = await connection.query(preparedQuery, [n]);

	return rows;
}

async function getAllUsersWithNoSubscriptions() {
	const connection = getDBConnection();

	const query = `SELECT usr.id, usr.\`name\`, usr.gender  
	FROM \`users\` AS usr 
	LEFT JOIN \`subscriptions\` AS subscr 
	ON usr.id = subscr.uid1
	WHERE subscr.uid1 IS NULL 
	ORDER BY usr.id ASC`;

	const [rows, fields] = await connection.query(query);

	return rows;
}

module.exports = {
	getAllUsersAndTheirSubscriptions,
	getAllUsersFriends,
	getUser,
	getNUsersWithMaxCountOfSubscriptions,
	getAllUsersWithNoSubscriptions
}
