const mysql = require('mysql2/promise');

require('dotenv').config();

let connection = null;

async function createDBConnection() {
	connection = await mysql.createConnection({
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME
	});

	return connection;
}

async function closeDBConnection() {
	await connection.end();
}

function getDBConnection() {
	return connection;
}

module.exports = {
	createDBConnection,
	closeDBConnection,
	getDBConnection
}
