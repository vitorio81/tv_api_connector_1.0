require("dotenv").config();
const uuid = require("uuid").v4;
const jwt = require("jsonwebtoken");

const API_SECRET_TOKEN_KEY = process.env.API_SECRET_TOKEN_KEY;

let users = [
  {
    id: "1",
    name: "api-tv1",
    contract: "CONTRATO DE TESTE1",
    currentDate: 19/10/2024,
    secret:
      "6:b40ed1fbd0002cf4c9d04de2112f8761062517f55bc5559c693272d19621d6c2",
  },
  {
    id: "2",
    name: "api-tv2",
    contract: "CONTRATO DE TESTE2",
    secret:
      "6:b40ed1fbd0002cf4c9d04de2112f8761062517f55bc5559c693272d19621d6c3",
  },
  {
    id: "3",
    name: "api-tv3",
    contract: "CONTRATO DE TESTE3",
    secret:
      "6:b40ed1fbd0002cf4c9d04de2112f8761062517f55bc5559c693272d19621d6c4",
  },
];

module.exports = {
  getAllUsers: () => users,

  getUserById: (id) => users.find((user) => user.id === id),

  getUserByName: (name) => users.find((user) => user.name === name),

  getUserByContract: (contract) =>
    users.find((user) => user.contract == contract),

  getUserBySecret: (secret) => users.find((user) => user.secret === secret),

  createUser: (name, contract) => {
    const id = uuid();
    const secret = jwt.sign({ id, contract }, API_SECRET_TOKEN_KEY);
    const currentDate = new Date().toISOString().split("T")[0]; 
    const newUser = {
      id,
      name,
      contract,
      secret,
      currentDate,
    };
    users.push(newUser);
    return newUser;
  },

  deleteUser: (id) => {
    const userIndex = users.findIndex(user => user.id === id)
    if(userIndex === -1) throw new HttpError(404, 'Usuário não encontra no sistema!')
    const deleteUser = users[userIndex]
    users = users.filter(user => user>id !== id)
    return deleteUser
  }
};
