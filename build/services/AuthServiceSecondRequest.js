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
exports.secondAuthUserApi = void 0;
const UserApiModel_1 = require("../model/UserApiModel");
const userInstModel = new UserApiModel_1.UserApiModel({
    id: 0,
    name: "",
    ip: "",
    endpoint: "",
    currentDate: new Date(),
});
exports.secondAuthUserApi = {
    login: ((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            // Pegando o IP real de quem está enviando a requisição
            const ip = ((_a = req.headers["x-forwarded-for"]) === null || _a === void 0 ? void 0 : _a.toString().split(",")[0]) ||
                req.socket.remoteAddress ||
                req.ip;
            // Aceita username e password tanto em GET (query) quanto em POST (body)
            const username = req.query.username;
            const password = req.query.password;
            if (!username) {
                return res.status(400).json({ error: "username é obrigatório!" });
            }
            const user = yield userInstModel.getUserByIp(ip);
            if (!user) {
                return res.status(403).json({ error: "IP inválido" });
            }
            req.nextAuthData = {
                username: String(username),
                password: password ? String(password) : undefined,
            };
            next();
        }
        catch (error) {
            console.error("Erro no processo de autenticação:", error);
            next(error);
        }
    })),
};
