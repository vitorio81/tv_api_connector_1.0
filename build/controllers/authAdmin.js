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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authAdmin = void 0;
const AdminModel_1 = require("../model/AdminModel");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const adminInstModel = new AdminModel_1.adminModel({
    id: 0,
    username: "",
    email: "",
    password: "",
    currentDate: new Date(),
});
exports.authAdmin = {
    register: ((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, username, password } = req.body;
            if (typeof username !== "string" ||
                typeof email !== "string" ||
                typeof password !== "string") {
                return res
                    .status(400)
                    .json({ message: "Todos os campos são obrigatórios" });
            }
            const existingAdmin = yield adminInstModel.getAdminByEmail(email);
            if (existingAdmin) {
                return res
                    .status(400)
                    .json({ massage: "Administrador já cadastrado!" });
            }
            else {
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                const newAdmin = yield adminInstModel.createAdmin({
                    username,
                    email,
                    password: hashedPassword,
                });
                return res.status(200).json(newAdmin);
            }
        }
        catch (error) {
            next(error);
        }
    })),
    login: ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            if (typeof email !== "string" || typeof password !== "string") {
                return res
                    .status(400)
                    .json({ message: "Todos as campos são obrigatórios!" });
            }
            const admin = yield adminInstModel.getAdminByEmail(email);
            if (!admin) {
                return res
                    .status(404)
                    .json({ message: "Administrador não encontrado!" });
            }
            const isValidPassword = yield bcrypt_1.default.compare(password, admin.password);
            if (!isValidPassword) {
                return res.status(401).json({ message: "Senha incorreta!" });
            }
            if (!env_1.config.jwtTokenAdmin) {
                return res.status(401).json({ message: "Java secreta não fornecida!" });
            }
            const payload = { id: admin.id, email: admin.email, username: admin.username };
            const token = jsonwebtoken_1.default.sign(payload, env_1.config.jwtTokenAdmin, {
                expiresIn: "30m",
            });
            res.json({ token, username: admin.username });
        }
        catch (error) {
            console.error("Erro no login:", error);
            res.status(500).json({ message: "Erro interno no servidor." });
        }
    })),
};
