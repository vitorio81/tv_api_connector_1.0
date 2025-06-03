import { RequestHandler } from "express";
import { UserApiModel } from "../model/UserApiModel";

declare module "express-serve-static-core" {
  interface Request {
    authData?: {
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

export const authUserApi = {
  login: (async (req, res, next) => {
    try {
      // Recebe dados do corpo da requisição (form-urlencoded)
      const { username, password} = req.body;
      const ip =
        req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
        req.socket.remoteAddress ||
        req.ip;
      console.log("IP do usuário:", ip);
      const userIp = await userInstModel.getUserByIp(ip as string);
      if (!userIp) {
        return res.status(403).json({ error: "API não autorizada pelo IP." });
      }

      // Validação dos campos obrigatórios
      if (
        !username ||
        typeof username !== "string" ||
        !password ||
        typeof password !== "string"
      ) {
        return res.status(400).json({
          error: "username e password são obrigatórios.",
        });
      }


      req.authData = { username, password};
      next();
    } catch (error) {
      console.error("Erro no processo de autenticação:", error);
      next(error);
    }
  }) as RequestHandler,
};
