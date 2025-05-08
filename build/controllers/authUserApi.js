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
const userApiModel_1 = require("../model/userApiModel");
const controllerFirstResquest_1 = require("./controllerFirstResquest");
const userInstModel = new userApiModel_1.userApiModel({
    id: 0,
    name: "",
    secret: "",
    endpoint: "",
    currentDate: new Date(),
});
exports.authUserApi = {
    login: ((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { secret, username, password } = req.body;
            const userSecret = yield userInstModel.getUserBySecret(secret);
            if (!userSecret) {
                return res.status(404).json({ error: "Token inválido!" });
            }
            if (!username || !password) {
                return res
                    .status(404)
                    .json({ error: "Password ou username não encontrados!" });
            }
            yield (0, controllerFirstResquest_1.controllerFirstResquest)(req, res, next);
        }
        catch (error) {
            next(error);
        }
    })),
};
