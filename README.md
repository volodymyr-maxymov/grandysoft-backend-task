# Grandysoft - Backend Task

This is an API server with next endpoints:

1. GET `/v1/users`.<br/>
Lists all users and their subscriptions.
2. GET `/v1/users/:id/friends?order_by=(id|name|gender)&order_type=(asc|desc)`.<br/>
Lists all friends of the specified user. Allows sorting by fields.
3. GET `/v1/max-following`.<br/>
Top 5 users with the maximum number of subscriptions.
4. GET `/v1/not-following`.<br/>
Lists all users with no subscriptions.

## Prerequisites

1. OS with Docker Engine installed on it.
2. Node 16+.

## General setup

1. Run `npm install`.
2. Create `.env` file in the project root with content like this one:
```
PORT=<API server port, for example - 8000>
DB_HOST=<db host>
DB_USER=<user>
DB_PASSWORD=<user password>
DB_ROOT_USER_PASSWORD=<root user password>
DB_NAME=<db name>
```
3. Run `docker-compose up`.

## Database setup

1. Run `npm run create-mysql-db`.

## Start API server

1. Run `npm run start-api-server`.

## Running

That is all! Now you can run API endpoints in Postman, for example: 

`http://localhost:8000/v1/users`
