import { RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({ path: "/srv/tv_api_connector_1.0/.env" });

const JWT_TOKEN_ADMIN = process.env.JWT_TOKEN_ADMIN || "default_secret_key ";

declare module "express-serve-static-core" {
  interface Request {
    admin?: {
      id: string;
      email: string;
      username: string;
    };
  }
}

export const verifyAdminToken: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ message: "Token não fornecido." });
    return;
  }

  const token = authHeader.split(" ")[1];
  const secret = JWT_TOKEN_ADMIN; ;

  if (!secret) {
    throw new Error(
      "JWT_TOKEN_ADMIN não está definido nas variáveis de ambiente."
    );
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.admin = {
      id: decoded.id,
      email: decoded.email,
      username: decoded.username,
    };
    next();
  } catch (err) {
    res.status(401).json({ message: "Token inválido ou expirado." });
    return;
  }
};
