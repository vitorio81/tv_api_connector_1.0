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
exports.RequestService = void 0;
const env_1 = require("../config/env");
const axios_1 = __importDefault(require("axios"));
class RequestService {
    static request(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (!env_1.config.hostIntegration)
                throw new Error("Host não configurado");
            if (!env_1.config.typeFirtsRequest)
                throw new Error("Type não configurado");
            const url = `${env_1.config.hostIntegration.toLowerCase()}/${env_1.config.typeFirtsRequest.toLowerCase()}`;
            try {
                const response = yield axios_1.default.get(url, {
                    headers: payload.headers,
                    data: payload.data
                });
                console.log(payload.headers);
                return response.data;
            }
            catch (error) {
                if (axios_1.default.isAxiosError(error)) {
                    console.error("Detalhes do erro IXC:", {
                        url,
                        status: (_a = error.response) === null || _a === void 0 ? void 0 : _a.status,
                        data: (_b = error.response) === null || _b === void 0 ? void 0 : _b.data,
                        config: error.config
                    });
                }
                throw new Error(`Falha na requisição: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
            }
        });
    }
}
exports.RequestService = RequestService;
