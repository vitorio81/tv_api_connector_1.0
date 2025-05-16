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
exports.authUserApi = {
    login: ((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            let host = "";
            if ((_a = req.body) === null || _a === void 0 ? void 0 : _a.host) {
                host = req.body.host;
            }
            else if ((_b = req.query) === null || _b === void 0 ? void 0 : _b.host) {
                host = req.query.host;
            }
            else if (req.headers["x-host"]) {
                host = req.headers["x-host"];
            }
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).json({ error: "Authorization header ausente!" });
            }
            let id, token;
            if (authHeader.startsWith("Basic ")) {
                try {
                    const base64Credentials = authHeader.split(" ")[1];
                    const credentials = Buffer.from(base64Credentials, "base64").toString("ascii");
                    [id, token] = credentials.split(":");
                }
                catch (error) {
                    return res
                        .status(401)
                        .json({ error: "Formato Basic Auth inválido!" });
                }
            }
            else {
                [id, token] = authHeader.split(":");
            }
            if (!id || !token) {
                return res.status(401).json({
                    error: "Formato inválido! Use Basic Auth ou 'id:token' no header Authorization.",
                });
            }
            const user = yield userInstModel.getUserBySecret(token);
            if (!user) {
                return res.status(403).json({ error: "Token inválido!" });
            }
            const userId = typeof user.id === "number" ? user.id.toString() : user.id;
            if (userId !== id) {
                return res
                    .status(403)
                    .json({ error: "ID não corresponde ao token fornecido!" });
            }
            const payload = req.method === "GET" ? req.query : req.body;
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
                username,
                token
            };
            next();
        }
        catch (error) {
            console.error("Erro no processo de autenticação:", error);
            next(error);
        }
    })),
};
