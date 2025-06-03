import { RequestHandler } from "express";
import { UserApiModel } from "../model/UserApiModel";

declare module "express-serve-static-core" {
  interface Request {
    nextAuthData?: {
      username?: string;
      password?: string;
    };
  }
}

const userInstModel = new UserApiModel({
  id: 0,
  name: "",
  ip: "",
  endpoint: "",
  currentDate: new Date(),
});

export const secondAuthUserApi = {
  login: (async (req, res, next) => {
    try {
      // Pegando o IP real de quem está enviando a requisição
      const ip =
        req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
        req.socket.remoteAddress ||
        req.ip;

      // Aceita username e password tanto em GET (query) quanto em POST (body)
      const username = req.query.username 
      const password = req.query.password 
      if (!username) {
        return res.status(400).json({ error: "username é obrigatório!" });
      }

      const user = await userInstModel.getUserByIp(ip as string);
      if (!user) {
        return res.status(403).json({ error: "IP inválido" });
      }

      req.nextAuthData = {
        username: String(username),
        password: password ? String(password) : undefined,
      };
      next();
    } catch (error) {
      console.error("Erro no processo de autenticação:", error);
      next(error);
    }
  }) as RequestHandler,
};
