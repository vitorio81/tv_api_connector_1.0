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
exports.controllerThirdRequest = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const controllerFourthRequest_1 = require("./controllerFourthRequest");
const requestModel_1 = require("../model/requestModel");
dotenv_1.default.config({ path: "/srv/tv_api_connector/.env" });
const TYPE_THIRD_REQUEST = process.env.TYPE_THIRD_REQUEST || "default_secret'key";
const requestIntModel = new requestModel_1.requestModel({
    id: 0,
    host: "",
    status: "",
    validate: false,
    dateTimerequest: new Date(),
});
const controllerThirdRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { host, idIntegration, username, clientId, secret, originalSecret } = req.integrationData;
    try {
        const basicAuthToken = Buffer.from(`${idIntegration}:${secret}`).toString("base64");
        const url = `${host.toLowerCase()}/${TYPE_THIRD_REQUEST.toLowerCase()}`;
        const headers = {
            ixcsoft: "listar",
            "Content-Type": "application/json",
            Authorization: `Basic ${basicAuthToken}`,
        };
        const data = {
            qtype: "cliente_contrato.id_cliente",
            query: clientId,
            oper: "=",
        };
        const response = yield axios_1.default.get(url, {
            headers,
            data,
        });
        const idContrato = response.data.registros[0].id;
        req.integrationData = {
            host: host,
            idIntegration: idIntegration,
            username: username,
            clientId: clientId,
            secret: secret,
            id: idContrato,
            originalSecret: originalSecret,
        };
        return (0, controllerFourthRequest_1.controllerFourthRequest)(req, res, next);
    }
    catch (error) {
        yield requestIntModel.createRequest({
            host,
            status: "error third request",
            validate: false,
            dateTimerequest: new Date(),
        });
        if (axios_1.default.isAxiosError(error)) {
            console.error("Erro na requisição:", error.response ? error.response.data : error.message);
        }
        else {
            console.error("Erro na requisição:", error);
        }
    }
});
exports.controllerThirdRequest = controllerThirdRequest;
