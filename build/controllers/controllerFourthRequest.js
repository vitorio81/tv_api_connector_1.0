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
exports.FourthRequesController = void 0;
const FourthRequestService_1 = require("../services/FourthRequestService");
const FourthAcessRequestPayload_1 = require("../model/FourthAcessRequestPayload");
const RequestModel_1 = require("../model/RequestModel");
const requestIntModel = new RequestModel_1.requestModel({
    id: 0,
    host: "",
    status: "",
    validate: false,
    dateTimerequest: new Date(),
});
class FourthRequesController {
    static handleDirect(id, host, basicAuthToken, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = FourthAcessRequestPayload_1.FourthAccessRequestPayload.create(id, basicAuthToken, host);
                const result = yield FourthRequestService_1.FourthRequestService.request(payload);
                yield requestIntModel.createRequest({
                    host,
                    status: "sucesso",
                    validate: true,
                    dateTimerequest: new Date(),
                });
                // Validação robusta do retorno
                const registros = Array.isArray(result.registros)
                    ? result.registros[0]
                    : [];
                const planosNaTv = Array.isArray(registros)
                    ? registros.filter((item) => typeof item.vd_contratos_produtos_descricao === "string" &&
                        item.vd_contratos_produtos_descricao.startsWith("NaTv"))
                    : [];
                const planosNaTvDescricao = planosNaTv.map((item) => item.vd_contratos_produtos_descricao);
                return res.status(200).json(planosNaTvDescricao);
            }
            catch (error) {
                yield requestIntModel.createRequest({
                    host,
                    status: `erro: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
                    validate: false,
                    dateTimerequest: new Date(),
                });
                // Só envia a resposta de erro, não chama next(error) após enviar resposta
                return res.status(500).json({
                    error: "Falha na integração",
                    details: error instanceof Error ? error.message : String(error),
                    integrationHost: host,
                });
            }
        });
    }
}
exports.FourthRequesController = FourthRequesController;
