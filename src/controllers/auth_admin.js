const admin_model = require("../model/admin_model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {

  
  register: async (req, res, next) => {

    try {
      const { username, email, password } = req.body;

      if (
        typeof username !== "string" ||
        typeof email !== "string" ||
        typeof password !== "string"
      ) {
        return res
          .status(400)
          .json({ message: "Todos os campos são obrigatórios" });
      }

      const existingAdmin = await admin_model.getAdminByEmail(email);
      if (existingAdmin) {
        return res
          .status(400)
          .json({ massage: "Administrador já cadastrado!" });
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = await admin_model.createAdmin(
          username,
          email,
          hashedPassword
        );
        return res.status(200).json(newAdmin);
      }
      
    } catch (error) {
      next(error);
      
    }
  },

  login: async (req, res) => {
    try { 
      const { email, password } = req.body;
      if (typeof email !== "string" || typeof password !== "string") {
        return res
          .status(400)
          .json({ message: "Todos as campos são obrigatórios!" });
      }

      const admin = await admin_model.getAdminByEmail(email);
      if (!admin) {
        return res
          .status(404)
          .json({ message: "Administrador não encontrado!" });
      }

      const isValidPassword = await bcrypt.compare(password, admin.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Senha incorreta!" });
      }

      const payload = { id: admin.id, email: admin.email };
      const token = jwt.si+gn(payload, process.env.JWT_TOKEN_ADMIN, {
        expiresIn: "30m",
      });
      res.json({ token });
      
    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ message: "Erro interno no servidor." });
    }
  },
};
