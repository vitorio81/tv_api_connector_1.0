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
exports.SecondRequestController = void 0;
const IxcModel_1 = require("../model/IxcModel");
const SecondRequestService_1 = require("../services/SecondRequestService");
const SecondAcessRequestPayload_1 = require("../model/SecondAcessRequestPayload");
const RequestModel_1 = require("../model/RequestModel");
const ControllerThirdRequest_1 = require("../controllers/ControllerThirdRequest"); // Certifique-se de importar corretamente
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
class SecondRequestController {
}
exports.SecondRequestController = SecondRequestController;
_a = SecondRequestController;
SecondRequestController.handle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    try {
        console.log("Iniciando handle");
        const { username } = req.nextAuthData;
        if (!username) {
            res.status(400).json({ error: "Dados de autenticação ausentes!" });
            return;
        }
        const integrationList = yield ixcInstModel.getAllIntegrations();
        console.log(`Total de integrações: ${integrationList.length}`);
        if (!integrationList || integrationList.length === 0) {
            res.status(400).json({ error: "Nenhuma integração cadastrada" });
            return;
        }
        let lastError = null;
        for (const [index, integration] of integrationList.entries()) {
            try {
                console.log(`Processando integração ${index + 1}/${integrationList.length}: ${integration.host}`);
                const basicAuthToken = Buffer.from(`${integration.idToken}:${integration.secret}`).toString("base64");
                console.log("Token gerado:", basicAuthToken);
                const host = integration.host;
                const payload = SecondAcessRequestPayload_1.AccessRequestPayload.create(username, basicAuthToken, host);
                console.log("Payload antes da requisição:", payload);
                const result = yield SecondRequestService_1.RequestService.request(payload);
                console.log("Resultado da requisição:", result);
                const idContrato = (_c = (_b = result.registros) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.id;
                if ((result === null || result === void 0 ? void 0 : result.total) === 1 || idContrato) {
                    yield requestIntModel.createRequest({
                        host: integration.host,
                        status: "sucesso",
                        validate: true,
                        dateTimerequest: new Date(),
                    });
                    console.log(`Usuário encontrado na integração ${integration.host}`);
                    console.log(idContrato);
                    // Chama a função ThirdAcessRequestPayload passando os dados necessários
                    yield ControllerThirdRequest_1.ThirdRequesController.handleDirect(idContrato, integration.host, basicAuthToken, res, next);
                    return;
                }
            }
            catch (error) {
                console.error(`Erro na integração ${integration.host}:`, error);
                lastError = error;
                yield requestIntModel.createRequest({
                    host: integration.host,
                    status: `erro: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
                    validate: false,
                    dateTimerequest: new Date(),
                });
            }
        }
        console.log("Todas as integrações foram processadas");
        res.status(404).json({
            error: "Usuário não encontrado em nenhuma integração",
            details: lastError instanceof Error ? lastError.message : String(lastError),
            tried: integrationList.length,
        });
    }
    catch (error) {
        console.error("Erro geral na controller:", error);
        next(error);
    }
});
