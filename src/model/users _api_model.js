require("dotenv").config();
const uuid = require("uuid").v4;
const jwt = require("jsonwebtoken");
const { query } = require("../../config_database/pool");

const API_SECRET_TOKEN_KEY = process.env.API_SECRET_TOKEN_KEY;


module.exports = {
  getAllUsers: async () => {
    const { rows } = await query (
      `SELECT
        id, name, contract, secret, currentdate AS "currentDate"
      FROM users
      `)
    return rows
  },

  /*getUserById: (id) => users.find((user) => user.id === id),

  getUserByName: (name) => users.find((user) => user.name === name),

  getUserByContract: (contract) =>
    users.find((user) => user.contract == contract),

  getUserBySecret: (secret) => users.find((user) => user.secret === secret),*/

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
    )
    return newUser;
  },

  /*deleteUser: (id) => {
    const userIndex = users.findIndex(user => user.id === id)
    if(userIndex === -1) throw new HttpError(404, 'Usuário não encontra no sistema!')
    const deleteUser = users[userIndex]
    users = users.filter(user => user>id !== id)
    return deleteUser
  }*/
};
