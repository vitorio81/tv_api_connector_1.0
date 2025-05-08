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
exports.authIntegration = void 0;
const ixcModel_1 = require("../model/ixcModel");
const integrationsModel = new ixcModel_1.ixcModel({
    id: 0,
    name: "",
    host: "",
    secret: "",
    idToken: 0,
    currentDate: new Date(),
});
exports.authIntegration = {
    login: ((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { secret } = req.body;
            const integrationSecret = yield integrationsModel.getIntegrationBySecre(secret);
            if (!integrationSecret) {
                return res
                    .status(404)
                    .json({ message: "Não esxite nenhuma integração Cadastrada" });
            }
            else {
                return res.status(200).json({ message: "Integração autorizada!" });
            }
        }
        catch (error) {
            next(error);
        }
    })),
};
