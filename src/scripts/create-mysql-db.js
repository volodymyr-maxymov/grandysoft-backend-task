const mysql = require('mysql2/promise');

require('dotenv').config();

const {createDBConnection, closeDBConnection} = require('../services/mysql');

let connection = null;
const numberOfUsersToCreate = getRandomIntInclusive(200, 250);
const maximumNumberOfFriends = 150;
const dummyUsersList = [
	{ name: 'John', gender: 'male' },
	{ name: 'Steve', gender: 'male' },
	{ name: 'Ann', gender: 'female' },
	{ name: 'Julia', gender: 'female' },
];

async function start() {
	try {
		console.log(`createDBConnection()...`);
		connection = await createDBConnection();
		console.log(`[done]`);
		console.log(`createTables()...`);
		await createTables();
		console.log(`[done]`);
		console.log(`createDummyUsers()...`);
		await createDummyUsers();
		console.log(`[done] - ${numberOfUsersToCreate} users were created`);
		console.log(`createLinksBetweenUsers()...`);
		await createLinksBetweenUsers();
		console.log(`[done]`);
		console.log(`closeDBConnection()...`);
		await closeDBConnection();
		console.log(`Script execution finished successfully!`);
	} catch (error) {
		console.log(`Script execution failed: ${error}`);
	}
}

async function createTables() {
	await connection.query(`CREATE TABLE \`users\`(
		\`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
		\`name\` VARCHAR(5) NOT NULL,
		\`gender\` ENUM('male','female') NOT NULL,
		PRIMARY KEY(\`id\`)
	)`);

	await connection.query(`CREATE TABLE \`subscriptions\`(
		\`uid1\` INT UNSIGNED NOT NULL,
		\`uid2\` INT UNSIGNED NOT NULL,
		PRIMARY KEY(\`uid1\`,\`uid2\`)
	)`);
}

async function createDummyUsers() {
	const preparedQuery = `INSERT INTO \`users\`(\`name\`, \`gender\`) VALUES ?`;
	const randomUsers = [];

	for (let i = 0; i <= numberOfUsersToCreate; i++) {
		const randomUserIndex = getRandomIntInclusive(0, 3);
		const randomUser = [dummyUsersList[randomUserIndex].name, dummyUsersList[randomUserIndex].gender];
		randomUsers.push(randomUser);
	}

	await connection.query(preparedQuery, [randomUsers], true);
}

async function createLinksBetweenUsers() {
	const preparedQuery = `INSERT INTO \`subscriptions\`(\`uid1\`, \`uid2\`) VALUES ?`;
	const randomLinks = [];
	const firstUID = 1;
	const lastUID = numberOfUsersToCreate + 1;
	const allUIDs = Array.from(new Array(lastUID).keys()); allUIDs.shift();

	for (let currentUID = firstUID; currentUID <= lastUID; currentUID++) {
		const numberOfLinksToCreate = getRandomIntInclusive(0, maximumNumberOfFriends);
		const allUIDsExceptingCurrentOne = allUIDs.filter(uid => uid !== currentUID);
		const randomUIDsForSubscriptions = getRandomAndUniqueArrayElements(allUIDsExceptingCurrentOne);

		for (let i = 0; i < numberOfLinksToCreate; i++) {
			const subscribedToUID = randomUIDsForSubscriptions.next().value;
			randomLinks.push([currentUID, subscribedToUID]);
		}
	}

	await connection.query(preparedQuery, [randomLinks], true);
}

function getRandomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function* getRandomAndUniqueArrayElements(array) {
	let i = array.length;

	while (i--) {
		yield array.splice(Math.floor(Math.random() * (i+1)), 1)[0];
	}
}

start();
