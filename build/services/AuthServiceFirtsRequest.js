"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authUserApi = void 0;
const UserApiModel_1 = require("../model/UserApiModel");
const userInstModel = new UserApiModel_1.userApiModel({
    id: 0,
    name: "",
    secret: "",
    endpoint: "",
    currentDate: new Date(),
});
function extractHost(req) {
    var _a, _b;
    return (((_a = req.body) === null || _a === void 0 ? void 0 : _a.host) || ((_b = req.query) === null || _b === void 0 ? void 0 : _b.host) || req.headers["x-host"] || "");
}
function parseAuthorizationHeader(header) {
    if (!header)
        return null;
    if (header.startsWith("Basic ")) {
        try {
            const base64Credentials = header.split(" ")[1];
            const credentials = Buffer.from(base64Credentials, "base64").toString("ascii");
            const [id, token] = credentials.split(":");
            if (!id || !token)
                return null;
            return { id, token };
        }
        catch (_a) {
            return null;
        }
    }
    const [id, token] = header.split(":");
    return id && token ? { id, token } : null;
}
exports.authUserApi = {
    login: ((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const host = extractHost(req);
            const authHeader = req.headers.authorization;
            const parsedAuth = parseAuthorizationHeader(authHeader);
            if (!parsedAuth) {
                return res.status(401).json({
                    error: "Cabeçalho Authorization inválido! Use Basic Auth ou 'id:token'.",
                });
            }
            const { id, token } = parsedAuth;
            const user = yield userInstModel.getUserBySecret(token);
            if (!user || ((_a = user.id) === null || _a === void 0 ? void 0 : _a.toString()) !== id) {
                return res.status(403).json({ error: "Token ou ID inválido!" });
            }
            const payload = req.method === "GET" ? req.query : req.body;
            const { username, password, get_id } = payload;
            const allMissing = (!username || typeof username !== "string" || username.trim() === "") &&
                (!password || typeof password !== "string" || password.trim() === "") &&
                (!get_id || typeof get_id !== "string" || get_id.trim() === "");
            if (allMissing) {
                return res.status(400).json({
                    error: "É necessário informar pelo menos um dos campos: username, password ou get_id.",
                });
            }
            req.authData = { username, password, get_id, token };
            next();
        }
        catch (error) {
            console.error("Erro no processo de autenticação:", error);
            next(error);
        }
    })),
};
