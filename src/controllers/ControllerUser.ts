import { query } from "../config/pool";
import { RequestHandler } from "express";
import { UserApiModel } from "../model/UserApiModel";

interface controllerUserPayloadAttributes {
  name: string;
  ip: string
}

const userModel = new UserApiModel({
  id: 0,
  name: "",
  ip: "",
  endpoint: "",
  currentDate: new Date(),
});

export const controllerUser = {
  register: (async (req, res, next) => {
    try {
      const { name, ip }: controllerUserPayloadAttributes = req.body;

      if (typeof name !== "string" || typeof ip !== "string") {
        return res
          .status(400)
          .json({ message: "Todos os campos são obrigatórios" });
      }

      const userName = await userModel.getUserByName(name);
      const userIp = await userModel.getUserByIp(ip);

      if (!userName || !userIp) {
        const newUsers = await userModel.createUser({ name, ip });
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
