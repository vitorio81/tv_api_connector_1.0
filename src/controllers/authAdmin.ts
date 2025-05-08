import { adminModel } from "../model/adminModel";
import { RequestHandler } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({ path: "/srv/tv_api_connector/.env" });

const JWT_TOKEN_ADMIN = process.env.JWT_TOKEN_ADMIN || "default_secret_key ";

interface authAdminPayloadAttributes {
  username: string;
  email: string;
  password: string;
}

const adminInstModel = new adminModel({
  id: 0,
  username: "",
  email: "",
  password: "",
  currentDate: new Date(),
});

export const authAdmin = {
  register: (async (req, res, next) => {
    try {
      const { email, username, password }: authAdminPayloadAttributes =
        req.body;

      if (
        typeof username !== "string" ||
        typeof email !== "string" ||
        typeof password !== "string"
      ) {
        return res
          .status(400)
          .json({ message: "Todos os campos são obrigatórios" });
      }

      const existingAdmin = await adminInstModel.getAdminByEmail(email);
      if (existingAdmin) {
        return res
          .status(400)
          .json({ massage: "Administrador já cadastrado!" });
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = await adminInstModel.createAdmin({
          username,
          email,
          password: hashedPassword,
        });
        return res.status(200).json(newAdmin);
      }
    } catch (error) {
      next(error);
    }
  }) as RequestHandler,

  login: (async (req, res) => {
    try {
      const { email, password }: authAdminPayloadAttributes = req.body;
      if (typeof email !== "string" || typeof password !== "string") {
        return res
          .status(400)
          .json({ message: "Todos as campos são obrigatórios!" });
      }

      const admin = await adminInstModel.getAdminByEmail(email);
      if (!admin) {
        return res
          .status(404)
          .json({ message: "Administrador não encontrado!" });
      }

      const isValidPassword = await bcrypt.compare(password, admin.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Senha incorreta!" });
      }
      if (!JWT_TOKEN_ADMIN) {
        return res.status(401).json({ message: "Java secreta não fornecida!" });
      }
      const payload = { id: admin.id, email: admin.email, username: admin.username};
      const token = jwt.sign(payload, JWT_TOKEN_ADMIN, {
        expiresIn: "30m",
      });
      res.json({ token, username: admin.username });
    } catch (error) {
      console.error("Erro no login:", error);
      res.status(500).json({ message: "Erro interno no servidor." });
    }
  }) as RequestHandler,
};
