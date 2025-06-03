import { query } from "./pool";

async function createTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS admin (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL,
      password VARCHAR(100) NOT NULL,
      currentdate DATE NOT NULL
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS integrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      host VARCHAR(100) NOT NULL,
      secret VARCHAR(100) NOT NULL,
      idtoken INT NOT NULL,
      currentdate DATE NOT NULL
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS requests (
      id SERIAL PRIMARY KEY,
      host VARCHAR(100) NOT NULL,
      status VARCHAR(50) NOT NULL,
      validate VARCHAR(10) NOT NULL,
      datetimerequest TIMESTAMP NOT NULL
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      ip VARCHAR(45) NOT NULL,
      endpoint VARCHAR(150) NOT NULL,
      currentdate DATE NOT NULL
    );
  `);

  console.log("Tabelas criadas com sucesso!");
  process.exit(0);
}

createTable();
