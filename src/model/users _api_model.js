require("dotenv").config();
const jwt = require("jsonwebtoken");
const { query } = require("../../config_database/pool");

const API_SECRET_TOKEN_KEY = process.env.API_SECRET_TOKEN_KEY;

module.exports = {
  getAllUsers: async () => {
    const { rows } = await query(
      `SELECT
        id, name, contract, secret, currentdate AS "currentDate"
      FROM users
    `
    );
    return rows;
  },

  getUserById: async (id) => {
    const { rows } = await query(
      `SELECT 
      id, name, contract, secret, currentdate AS "currentDate"
    FROM users WHERE id = $1
    `,
      [id]
    );
    return rows[0];
  },

  getUserByName: async (name) => {
    const { rows } = await query(
      ` SELECT 
      id, name, contract, secret, currentdate AS "currentDate"
      FROM users WHERE name = $1`,
      [name]
    );
    return rows[0];
  },

  getUsersByPartialName: async (partialName) => {
    const { rows } = await query(
      `SELECT 
      id, name, contract, secret, currentdate AS "currentDate"
     FROM users
     WHERE name ILIKE $1`,
      [`%${partialName}%`]
    );
    return rows; // Retorna todos os usuários que contenham 'partialName' no nome
  },

  getUserByContract: async (contract) => {
    const { rows } = await query(
      ` SELECT 
      id, name, contract, secret, currentdate AS "currentDate"
      FROM users WHERE contract = $1`,
      [contract]
    );
    return rows[0];
  },

  getUserBySecret: async (secret) => {
    const { rows } = await query(
      ` SELECT 
      id, name, contract, secret, currentdate AS "currentDate"
      FROM users WHERE secret = $1`,
      [secret]
    );
    return rows[0];
  },

  createUser: async (name, contract) => {
    const secret = jwt.sign({ contract }, API_SECRET_TOKEN_KEY);
    const currentDate = new Date().toISOString().split("T")[0];
    const newUser = {
      name,
      contract,
      secret,
      currentDate,
    };
    await query(
      `INSERT INTO users (name, contract, secret, currentdate) VALUES ($1, $2, $3, $4);`,
      [name, contract, secret, currentDate]
    );
    return newUser;
  },
};
