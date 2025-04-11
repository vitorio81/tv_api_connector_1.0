const admin_model = require("../model/admin_model");
const usersModel = require("../model/users _api_model");
const jwt = require("jsonwebtoken");

module.exports = {
  register: (req, res) => {
    const { username, email, password } = req.body;

    if (typeof username !== 'string' || typeof email !== 'string' || password !== 'string') {
      return res
        .status(400)
        .json({ message: "Todos os campos são obrigatórios" });
    }

    const existingAdmin = admin_model.getAdminByEmail(email);
    if (existingAdmin) {
      return res.status(400).json({ massage: "Administrador já cadastrado!" });
    } else {
      const newAdmin = admin_model.createAdmin(username, email, password);
      return res.status(200).json(newAdmin);
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body;
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res
        .status(400)
        .json({ message: "Todos as campos são obrigatórios!" });
    }

    const admin = admin_model.getAdminByEmail(email)
    if (!admin) {
      return res.status(404).json({ message: "Administrador não encontrado!" });
    }

    const isValidPassword = admin.password === password
    if(!isValidPassword) {
      return res.status(401).json({ message: "Senha incorreta!" });
    }

    const payload = { id: admin.id, email: admin.email };
     const token = jwt.sign(payload, process.env.JWT_TOKEN_ADMIN, {expiresIn: '1d'});
     res.json({token})
  },
};
