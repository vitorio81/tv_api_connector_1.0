const { query } = require("./pool");


async function createTable() {
    await query(`
        CREATE TABLE IF NOT EXISTS admin (
            id SERIAL PRIMARY KEY,
            username VARCHAR(250) NOT NULL,
            email VARCHAR(250) NOT NULL,
            password VARCHAR(250) NOT NULL,
            currentdate DATE NOT NULL
        );
        CREATE TABLE IF NOT EXISTS integrations (
            id SERIAL PRIMARY KEY,
            name VARCHAR(250) NOT NULL,
            host VARCHAR(250) NOT NULL,
            secret VARCHAR(250) NOT NULL,
            type VARCHAR(250) NOT NULL,
            currentdate DATE NOT NULL
        );
        CREATE TABLE IF NOT EXISTS requests (
            id SERIAL PRIMARY KEY,
            host VARCHAR(250) NOT NULL,
            status VARCHAR(250) NOT NULL,
            validate VARCHAR(250) NOT NULL,
            datetimerequest TIMESTAMP NOT NULL
        );
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(250) NOT NULL,
            contract VARCHAR(250) NOT NULL,
            secret VARCHAR(250) NOT NULL,
            currentdate DATE NOT NULL
        );
    `);
    console.log("Events table created sucessfully!")

    process.exit(0)
}

createTable();