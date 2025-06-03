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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirstRequestController = void 0;
const IxcModel_1 = require("../model/IxcModel");
const FirstRequestService_1 = require("../services/FirstRequestService");
const FirtsAcessRequestPayload_1 = require("../model/FirtsAcessRequestPayload");
const RequestModel_1 = require("../model/RequestModel");
const ixcInstModel = new IxcModel_1.ixcModel({
    id: 0,
    name: "",
    host: "",
    secret: "",
    idToken: 0,
    currentDate: new Date(),
});
const requestIntModel = new RequestModel_1.requestModel({
    id: 0,
    host: "",
    status: "",
    validate: false,
    dateTimerequest: new Date(),
});
class FirstRequestController {
}
exports.FirstRequestController = FirstRequestController;
_a = FirstRequestController;
FirstRequestController.handle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    try {
        const { username, password } = req.authData;
        const integrationList = yield ixcInstModel.getAllIntegrations();
        if (!integrationList || integrationList.length === 0) {
            res.status(404).json({ error: "Nenhuma integração cadastrada" });
            return;
        }
        let usuarioEncontrado = false;
        for (const integration of integrationList) {
            try {
                const basicAuthToken = Buffer.from(`${integration.idToken}:${integration.secret}`).toString("base64");
                const payload = FirtsAcessRequestPayload_1.AccessRequestPayload.create(username, basicAuthToken, integration.host);
                const result = yield FirstRequestService_1.RequestService.request(payload);
                // Usuário encontrado
                if ((result === null || result === void 0 ? void 0 : result.total) === 1) {
                    usuarioEncontrado = true;
                    const senhaUser = (_c = (_b = result.registros) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.senha;
                    // Senha correta
                    if (senhaUser === password) {
                        yield requestIntModel.createRequest({
                            host: integration.host,
                            status: "sucesso",
                            validate: true,
                            dateTimerequest: new Date(),
                        });
                        res.status(200).json("Usuário autorizado");
                        return;
                    }
                    else {
                        // Senha incorreta
                        yield requestIntModel.createRequest({
                            host: integration.host,
                            status: "não autorizado",
                            validate: false,
                            dateTimerequest: new Date(),
                        });
                        res.status(401).json({ error: "Usuário não autorizado" });
                        return;
                    }
                }
            }
            catch (error) {
                yield requestIntModel.createRequest({
                    host: integration.host,
                    status: `erro: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
                    validate: false,
                    dateTimerequest: new Date(),
                });
            }
        }
        // Se não encontrou usuário em nenhuma integração
        if (!usuarioEncontrado) {
            res.status(404).json({ error: "Usuário inexistente" });
        }
    }
    catch (error) {
        next(error);
    }
});
