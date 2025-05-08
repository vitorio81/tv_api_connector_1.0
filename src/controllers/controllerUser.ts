import { query } from "../config_database/pool";
import { RequestHandler } from "express";
import { userApiModel } from "../model/userApiModel";

interface controllerUserPayloadAttributes {
  name: string;
  contract: string;
}

const userModel = new userApiModel({
  id: 0,
  name: "",
  secret: "",
  endpoint: "",
  currentDate: new Date(),
});

export const controllerUser = {
  register: (async (req, res, next) => {
    try {
      const { name }: controllerUserPayloadAttributes = req.body;

      if (typeof name !== "string") {
        return res
          .status(400)
          .json({ message: "Todos os campos são obrigatórios" });
      }

      const userName = await userModel.getUserByName(name);

      if (!userName) {
        const newUsers = await userModel.createUser({ name });
        return res.status(201).json(newUsers);
      } else {
        return res.status(400).json({ error: "Usuário já existente!" });
      }
    } catch (error) {
      next(error);
    }
  }) as RequestHandler,

  index: (async (req, res, next) => {
    try {
      const users = await userModel.getAllUsers();
      res.json({ data: users });
    } catch (error) {
      next(error);
    }
  }) as RequestHandler,

  delete: (async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await userModel.getUserById(Number(id));
      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado!" });
      }

      await query(`DELETE FROM users WHERE id = $1`, [id]);
      return res.json({ data: `Usuário deletado: ${user.name || "sem nome"}` });
    } catch (error) {
      next(error);
    }
  }) as RequestHandler,
};
