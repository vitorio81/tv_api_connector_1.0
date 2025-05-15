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
exports.controllerIxc = void 0;
const pool_1 = require("../config/pool");
const IxcModel_1 = require("../model/IxcModel");
const ixcInstModel = new IxcModel_1.ixcModel({
    id: 0,
    name: "",
    host: "",
    secret: "",
    idToken: 0,
    currentDate: new Date(),
});
exports.controllerIxc = {
    register: ((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name, host, secret, idToken } = req.body;
            if (typeof name !== "string" ||
                typeof host !== "string" ||
                typeof secret !== "string" ||
                typeof idToken !== "number") {
                return res
                    .status(400)
                    .json({ message: "Todos os campos são obrigatórios" });
            }
            const existingIntegrationName = yield ixcInstModel.getIntegrationByName(name);
            const existingIntegrationSecret = yield ixcInstModel.getIntegrationBySecre(secret);
            if (!existingIntegrationName || !existingIntegrationSecret) {
                const newIntegration = yield ixcInstModel.createIntegration({
                    name,
                    host,
                    secret,
                    idToken,
                });
                return res.status(200).json(newIntegration);
            }
            else {
                return res.status(400).json({ error: "Integração já existente!" });
            }
        }
        catch (error) {
            next(error);
        }
    })),
    index: ((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const integrations = yield ixcInstModel.getAllIntegrations();
            res.json({ data: integrations });
        }
        catch (error) {
            next(error);
        }
    })),
    show: ((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const integration = yield ixcInstModel.getIntegrationById(Number(id));
            if (!integration) {
                return res.status(404).json({ message: "Integração não encontrada" });
            }
            res.json({ data: integration });
        }
        catch (error) {
            next(error);
        }
    })),
    delete: ((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const deleteIntegration = yield ixcInstModel.getIntegrationById(Number(id));
            if (!deleteIntegration) {
                return res.status(404).json({ error: "Integração não encontrada!" });
            }
            yield (0, pool_1.query)(`DELETE FROM integrations WHERE id = $1`, [id]);
            return res.json({
                data: `Integração deletada: ${deleteIntegration.name || "sem nome"}`,
            });
        }
        catch (error) {
            next(error);
        }
    })),
};
