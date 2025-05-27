import { RequestHandler } from "express";
import { userApiModel } from "../model/UserApiModel";

declare module "express-serve-static-core" {
  interface Request {
    authData?: {
      username?: string;
      password?: string;
      token: string;
      get_id?: string;
    };
  }
}

interface AuthApiPayload {
  username: string;
  secret: string;
  password: string;
  host?: string;
  get_id: string;
}

const userInstModel = new userApiModel({
  id: 0,
  name: "",
  secret: "",
  endpoint: "",
  currentDate: new Date(),
});

function extractHost(req: any): string {
  return (
    req.body?.host || req.query?.host || (req.headers["x-host"] as string) || ""
  );
}

function parseAuthorizationHeader(
  header: string | undefined
): { id: string; token: string } | null {
  if (!header) return null;

  if (header.startsWith("Basic ")) {
    try {
      const base64Credentials = header.split(" ")[1];
      const credentials = Buffer.from(base64Credentials, "base64").toString(
        "ascii"
      );
      const [id, token] = credentials.split(":");
      if (!id || !token) return null;
      return { id, token };
    } catch {
      return null;
    }
  }

  const [id, token] = header.split(":");
  return id && token ? { id, token } : null;
}

export const authUserApi = {
  login: (async (req, res, next) => {
    try {
      const host = extractHost(req);
      const authHeader = req.headers.authorization;

      const parsedAuth = parseAuthorizationHeader(authHeader);
      if (!parsedAuth) {
        return res.status(401).json({
          error:
            "Cabeçalho Authorization inválido! Use Basic Auth ou 'id:token'.",
        });
      }

      const { id, token } = parsedAuth;

      const user = await userInstModel.getUserBySecret(token);
      if (!user || user.id?.toString() !== id) {
        return res.status(403).json({ error: "Token ou ID inválido!" });
      }

      const payload: Partial<AuthApiPayload> =
        req.method === "GET" ? req.query : req.body;
      const { username, password, get_id } = payload;

      const allMissing =
        (!username || typeof username !== "string" || username.trim() === "") &&
        (!password || typeof password !== "string" || password.trim() === "") &&
        (!get_id || typeof get_id !== "string" || get_id.trim() === "");

      if (allMissing) {
        return res.status(400).json({
          error:
            "É necessário informar pelo menos um dos campos: username, password ou get_id.",
        });
      }

      req.authData = { username, password, get_id, token };
      next();
    } catch (error) {
      console.error("Erro no processo de autenticação:", error);
      next(error);
    }
  }) as RequestHandler,
};
