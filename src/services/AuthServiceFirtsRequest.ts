import { RequestHandler } from "express";
import { userApiModel } from "../model/UserApiModel";

// PRECISO REFAZER O BACK END PARA MELHORAR O FLUXO DOS PROCESSOS
// PRECISO FAZER UMA ROTA PARA CADA REQUISIÇÃO USANDO O TYPE DO IXC
// TESTAR AS CONEXÇÕES E O BUILD PARA FAZER FUNCIONAR O START

interface authApiModelPayloadAttributes {
  username: string;
  secret: string;
  password: string;
  host?: string;
}

declare module "express-serve-static-core" {
  interface Request {
    authData?: {
      host: string;
      username: string;
      password: string;
      secret: string;
    };
  }
}

const userInstModel = new userApiModel({
  id: 0,
  name: "",
  secret: "",
  endpoint: "",
  currentDate: new Date(),
});

export const authUserApi = {
  login: (async (req, res, next) => {
    try {
      let host = "";

      if (req.body?.host) {
        host = req.body.host;
      } else if (req.query?.host) {
        host = req.query.host as string;
      } else if (req.headers["x-host"]) {
        host = req.headers["x-host"] as string;
      }

      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ error: "Authorization header ausente!" });
      }

      let id: string, token: string;

      if (authHeader.startsWith("Basic ")) {
        try {
          const base64Credentials = authHeader.split(" ")[1];
          const credentials = Buffer.from(base64Credentials, "base64").toString(
            "ascii"
          );
          [id, token] = credentials.split(":");
        } catch (error) {
          return res
            .status(401)
            .json({ error: "Formato Basic Auth inválido!" });
        }
      } else {
        [id, token] = authHeader.split(":");
      }

      if (!id || !token) {
        return res.status(401).json({
          error:
            "Formato inválido! Use Basic Auth ou 'id:token' no header Authorization.",
        });
      }

      const user = await userInstModel.getUserBySecret(token);
      if (!user) {
        return res.status(403).json({ error: "Token inválido!" });
      }

      const userId = typeof user.id === "number" ? user.id.toString() : user.id;
      if (userId !== id) {
        return res
          .status(403)
          .json({ error: "ID não corresponde ao token fornecido!" });
      }

      const payload: Partial<authApiModelPayloadAttributes> =
        req.method === "GET" ? req.query : req.body;
      const { username, password } = payload;

      if (!username || !password) {
        return res.status(400).json({
          error: "Username e password são obrigatórios!",
        });
      }

      if (typeof username !== "string" || typeof password !== "string") {
        return res.status(400).json({
          error: "Username e password devem ser strings válidas!",
        });
      }

      if (username.trim() === "" || password.trim() === "") {
        return res.status(400).json({
          error: "Username e password não podem ser vazios!",
        });
      }
      req.authData = {
        host,
        username,
        password,
        secret: token,
      };
      next();
    } catch (error) {
      console.error("Erro no processo de autenticação:", error);
      next(error);
    }
  }) as RequestHandler,
};
