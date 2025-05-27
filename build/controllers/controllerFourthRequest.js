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
exports.FourthRequesController = void 0;
const FourthRequestService_1 = require("../services/FourthRequestService");
const FourthAcessRequestPayload_1 = require("../model/FourthAcessRequestPayload");
const RequestModel_1 = require("../model/RequestModel");
const IntegrationStore_1 = require("../services/IntegrationStore");
const requestIntModel = new RequestModel_1.requestModel({
    id: 0,
    host: "",
    status: "",
    validate: false,
    dateTimerequest: new Date(),
});
class FourthRequesController {
}
exports.FourthRequesController = FourthRequesController;
_a = FourthRequesController;
FourthRequesController.handle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.authData) {
            res.status(400).json({ error: "Dados de autenticação ausentes!" });
            return;
        }
        const { get_id, token } = req.authData;
        const integration = (0, IntegrationStore_1.getIntegration)(token);
        if (!integration) {
            res
                .status(404)
                .json({ error: "Integração não encontrada para esse token." });
            return;
        }
        const host = integration.host;
        const basicAuthToken = integration.secret;
        try {
            const payload = yield FourthAcessRequestPayload_1.FourthAccessRequestPayload.create(get_id, basicAuthToken, host);
            const result = yield FourthRequestService_1.FourthRequestService.request(payload);
            console.log("Resultado da requisição:", result);
            yield requestIntModel.createRequest({
                host: host,
                status: "sucesso",
                validate: true,
                dateTimerequest: new Date(),
            });
            console.log(result);
            res.status(200).json(result);
            return;
        }
        catch (error) {
            console.error("Erro na requisição:", error);
            yield requestIntModel.createRequest({
                host,
                status: `erro: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
                validate: false,
                dateTimerequest: new Date(),
            });
            res.status(500).json({
                error: "Falha na integração",
                details: error instanceof Error ? error.message : String(error),
                integrationHost: host,
            });
        }
    }
    catch (error) {
        console.error("Erro geral na controller:", error);
        next(error);
    }
});
;
