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
exports.ThirdRequesController = void 0;
const ThirdRequestService_1 = require("../services/ThirdRequestService ");
const ThirdAcessRequestPayload_1 = require("../model/ThirdAcessRequestPayload");
const ControllerFourthRequest_1 = require("./ControllerFourthRequest");
const RequestModel_1 = require("../model/RequestModel");
const requestIntModel = new RequestModel_1.requestModel({
    id: 0,
    host: "",
    status: "",
    validate: false,
    dateTimerequest: new Date(),
});
class ThirdRequesController {
    static handleDirect(id, host, basicAuthToken, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const payload = ThirdAcessRequestPayload_1.ThirdAccessRequestPayload.create(id, basicAuthToken, host);
                const result = yield ThirdRequestService_1.SecondRequestService.request(payload);
                yield requestIntModel.createRequest({
                    host,
                    status: "sucesso",
                    validate: true,
                    dateTimerequest: new Date(),
                });
                const idContrato = (_b = (_a = result.registros) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.id;
                yield ControllerFourthRequest_1.FourthRequesController.handleDirect(idContrato, host, basicAuthToken, res, next);
                return;
            }
            catch (error) {
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
                next(error);
            }
        });
    }
}
exports.ThirdRequesController = ThirdRequesController;
