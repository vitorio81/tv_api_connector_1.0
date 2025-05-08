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
exports.controllerFirstResquest = void 0;
const axios_1 = __importDefault(require("axios"));
const ixcModel_1 = require("../model/ixcModel");
const controllerSecondRequest_1 = require("./controllerSecondRequest");
const dotenv_1 = __importDefault(require("dotenv"));
;
const inspector_1 = require("inspector");
const requestModel_1 = require("../model/requestModel");
dotenv_1.default.config({ path: "/srv/tv_api_connector/.env" });
const TYPE_FIRST_REQUEST = process.env.TYPE_FIRST_REQUEST || "default_secret_key";
const TYPE_LOGIN_USER = process.env.TYPE_LOGIN_USER || "default_secret_key";
const HOST = process.env.HOST || "default_secret_key";
const ixcInstModel = new ixcModel_1.ixcModel({
    id: 0,
    name: "",
    host: "",
    secret: "",
    idToken: 0,
    currentDate: new Date,
});
const requestIntModel = new requestModel_1.requestModel({
    id: 0,
    host: "",
    status: "",
    validate: false,
    dateTimerequest: new Date(),
});
const controllerFirstResquest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { host, secret: originalSecret, username, password, } = req.body;
    try {
        const integrationList = yield ixcInstModel.getAllIntegrations();
        for (let integration of integrationList) {
            try {
                console.log("Tentando integração com:", integration.host);
                console.log("secret:", integration.secret);
                console.log("token:", integration.idToken);
                const host = integration.host;
                const url = `${host.toLowerCase()}/${TYPE_FIRST_REQUEST.toLowerCase()}`;
                const idIntegration = integration.idToken;
                const secret = integration.secret;
                const basicAuthToken = Buffer.from(`${idIntegration}:${secret}`).toString("base64");
                const headers = {
                    ixcsoft: "listar",
                    "Content-Type": "application/json",
                    Authorization: `Basic ${basicAuthToken}`,
                };
                const data = {
                    qtype: "cliente.hotsite_email",
                    query: username,
                    oper: "=",
                    page: "1",
                    rp: "20",
                    sortname: "cliente.id",
                    sortorder: "desc",
                };
                const response = yield axios_1.default.get(`${url}`, {
                    headers,
                    data,
                });
                const senhaCliente = response.data.registros[0].senha;
                console.log("Senha do cliente:", senhaCliente);
                if (senhaCliente === password) {
                    req.integrationData = {
                        host: integration.host,
                        idIntegration: integration.idToken,
                        username,
                        secret: integration.secret,
                        originalSecret: originalSecret,
                    };
                    return (0, controllerSecondRequest_1.controllerSecondRequest)(req, res, next);
                }
                else {
                    yield requestIntModel.createRequest({
                        host,
                        status: "sucesso",
                        validate: false,
                        dateTimerequest: new Date(),
                    });
                    return res.status(200).json({
                        host: HOST,
                        type: TYPE_LOGIN_USER,
                        secret: originalSecret,
                        username,
                        validate: false,
                        message: "Senha ou usuário inválido.",
                    });
                }
            }
            catch (error) {
                console.error(`Erro ao tentar integração com ${inspector_1.url}:`, axios_1.default.isAxiosError(error)
                    ? (_a = error.response) === null || _a === void 0 ? void 0 : _a.data
                    : error.message);
                yield requestIntModel.createRequest({
                    host,
                    status: "erro",
                    validate: false,
                    dateTimerequest: new Date(),
                });
            }
        }
        yield requestIntModel.createRequest({
            host,
            status: "sucesso",
            validate: false,
            dateTimerequest: new Date(),
        });
        return res.status(200).json({
            host: HOST,
            type: TYPE_LOGIN_USER,
            secret: originalSecret,
            username,
            validate: false,
            message: "Cliente não encontrado",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.controllerFirstResquest = controllerFirstResquest;
