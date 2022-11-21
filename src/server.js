const http = require('http');

require('dotenv').config();

const app = require('./app');
const { createDBConnection } = require('./services/mysql');

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
	await createDBConnection();

	server.listen(PORT, () => {
		console.log(`Listening on port: ${PORT}`);
	});
}

startServer();
