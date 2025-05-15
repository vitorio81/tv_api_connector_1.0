"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAdminToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "/srv/tv_api_connector_1.0/.env" });
const JWT_TOKEN_ADMIN = process.env.JWT_TOKEN_ADMIN || "default_secret_key ";
const verifyAdminToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ message: "Token não fornecido." });
        return;
    }
    const token = authHeader.split(" ")[1];
    const secret = JWT_TOKEN_ADMIN;
    ;
    if (!secret) {
        throw new Error("JWT_TOKEN_ADMIN não está definido nas variáveis de ambiente.");
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        req.admin = {
            id: decoded.id,
            email: decoded.email,
            username: decoded.username,
        };
        next();
    }
    catch (err) {
        res.status(401).json({ message: "Token inválido ou expirado." });
        return;
    }
};
exports.verifyAdminToken = verifyAdminToken;
