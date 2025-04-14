const users_api_model = require("../model/users _api_model")


module.exports = {
    
  register: async (req, res) => {
    const { name, contract } = req.body;

    if (typeof name !== "string" || typeof contract !== "string") {
      return res
        .status(400)
        .json({ message: "Todos os campos são obrigatórios" });
    }
      const newUsers = await users_api_model.createUser(name, contract);
      return res.status(201).json(newUsers);
  },

  index: async (req, res) => {
    const users = users_api_model.getAllUsers();
    return res.json({
      data: users
    });
  },

  delete: (req, res) => {
    const { id } = req.params;
    const users = users_api_model.getAllUsers(id);
    return res.status(200).json(users);
  },
};