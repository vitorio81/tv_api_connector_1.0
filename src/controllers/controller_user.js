const { query } = require("../../config_database/pool");
const users_api_model = require("../model/users _api_model");

module.exports = {
  register: async (req, res, next) => {
    try {
      const { name, contract } = req.body;

      if (typeof name !== "string" || typeof contract !== "string") {
        return res
          .status(400)
          .json({ message: "Todos os campos são obrigatórios" });
      }

      const userName = await users_api_model.getUserByName(name);
      const userContract = await users_api_model.getUserByContract(contract);

      if (!userName || !userContract) {
        const newUsers = await users_api_model.createUser(name, contract);
        return res.status(201).json(newUsers);
      } else {
        return res.status(400).json({ error: "Usuário já existente!" });
      }
    } catch (error) {
      next(error); // envia para o middleware de erro
    }
  },

  index: async (req, res, next) => {
    try {
      const users = await users_api_model.getAllUsers();
      res.json({ data: users });
    } catch (error) {
      next(error); // envia para o middleware de erro
    }
  },

  delete: async (req, res, next) => {
    try {
      const { id } = req.params;

      const user = await users_api_model.getUserById(id);
      if (!user.length) {
        return res.status(404).json({ error: "Usuário não encontrado!" });
      }

      await query(`DELETE FROM users WHERE id = $1`, [id]);
      return res.json({ data: `Usuário deletado: ${user[0].name}` });
    } catch (error) {
      next(error); // envia para o middleware de erro
    }
  },
};
