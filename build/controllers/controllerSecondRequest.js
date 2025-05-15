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
exports.SecondRequesController = void 0;
const IxcModel_1 = require("../model/IxcModel");
const SecondRequestService_1 = require("../services/SecondRequestService ");
const SecondAcessRequestPayload_1 = require("../model/SecondAcessRequestPayload");
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
class SecondRequesController {
}
exports.SecondRequesController = SecondRequesController;
_a = SecondRequesController;
SecondRequesController.handle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query } = req.nextAuthData;
        const integrationList = yield ixcInstModel.getAllIntegrations();
        if (!integrationList || integrationList.length === 0) {
            res.status(400).json({ error: "Nenhuma integração cadastrada" });
            return;
        }
        let lastError = null;
        for (const integration of integrationList) {
            try {
                const basicAuthToken = Buffer.from(`${integration.idToken}:${integration.secret}`).toString("base64");
                console.log(basicAuthToken);
                console.log(integration.secret);
                const payload = SecondAcessRequestPayload_1.SecondAccessRequestPayload.create(query, basicAuthToken);
                const result = yield SecondRequestService_1.SecondRequestService.request(payload);
                yield requestIntModel.createRequest({
                    host: integration.host,
                    status: "sucesso",
                    validate: true,
                    dateTimerequest: new Date(),
                });
                console.log(result);
                res.status(200).json(result);
                return;
            }
            catch (error) {
                lastError = error;
                yield requestIntModel.createRequest({
                    host: integration.host,
                    status: `erro: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
                    validate: false,
                    dateTimerequest: new Date(),
                });
            }
        }
        res.status(500).json({
            error: "Todas as integrações falharam",
            details: lastError instanceof Error ? lastError.message : String(lastError),
            tried: integrationList.length,
        });
    }
    catch (error) {
        console.error("Erro geral na controller:", error);
        next(error);
    }
});
