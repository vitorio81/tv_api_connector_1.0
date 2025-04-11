const users_api_model = require("../model/users _api_model")


module.exports = {
    
  register: (req, res) => {
    const { name, contract } = req.body;

    if (typeof name !== "string" || typeof contract !== "string") {
      return res
        .status(400)
        .json({ message: "Todos os campos são obrigatórios" });
    }

    const existingUser = users_api_model.getUserByContract(contract);
    if (existingUser) {
      return res.status(400).json({ massage: "Contrato já cadastrado" });
    } else {
      const newUser = users_api_model.createUser(name, contract);
      return res.status(200).json(newUser);
    }
  },

  index: (req, res) => {
    const users = users_api_model.getAllUsers();
    return res.json(users);
  },

  delete: (req, res) => {
    const { id } = req.params;
    const users = users_api_model.getAllUsers(id);
    return res.status(200).json(users);
  },
};