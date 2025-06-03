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
exports.controllerUser = void 0;
const pool_1 = require("../config/pool");
const UserApiModel_1 = require("../model/UserApiModel");
const userModel = new UserApiModel_1.UserApiModel({
    id: 0,
    name: "",
    ip: "",
    endpoint: "",
    currentDate: new Date(),
});
exports.controllerUser = {
    register: ((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name, ip } = req.body;
            if (typeof name !== "string" || typeof ip !== "string") {
                return res
                    .status(400)
                    .json({ message: "Todos os campos são obrigatórios" });
            }
            const userName = yield userModel.getUserByName(name);
            const userIp = yield userModel.getUserByIp(ip);
            if (!userName || !userIp) {
                const newUsers = yield userModel.createUser({ name, ip });
                return res.status(201).json(newUsers);
            }
            else {
                return res.status(400).json({ error: "Usuário já existente!" });
            }
        }
        catch (error) {
            next(error);
        }
    })),
    index: ((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const users = yield userModel.getAllUsers();
            res.json({ data: users });
        }
        catch (error) {
            next(error);
        }
    })),
    delete: ((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const user = yield userModel.getUserById(Number(id));
            if (!user) {
                return res.status(404).json({ error: "Usuário não encontrado!" });
            }
            yield (0, pool_1.query)(`DELETE FROM users WHERE id = $1`, [id]);
            return res.json({ data: `Usuário deletado: ${user.name || "sem nome"}` });
        }
        catch (error) {
            next(error);
        }
    })),
};
