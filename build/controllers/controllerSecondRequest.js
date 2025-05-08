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
exports.controllerSecondRequest = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
const controllerThirdRequest_1 = require("./controllerThirdRequest");
const requestModel_1 = require("../model/requestModel");
dotenv_1.default.config({ path: "/srv/tv_api_connector/.env" });
const TYPE_SECOND_REQUEST = process.env.TYPE_SECOND_REQUEST || "default_secret_key";
const requestIntModel = new requestModel_1.requestModel({
    id: 0,
    host: "",
    status: "",
    validate: false,
    dateTimerequest: new Date(),
});
const controllerSecondRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { host, idIntegration, username, secret, originalSecret } = req.integrationData;
    try {
        const url = `${host.toLowerCase()}/${TYPE_SECOND_REQUEST.toLowerCase()}`;
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
        const idCliente = response.data.registros[0].id;
        req.integrationData = {
            host: host,
            idIntegration: idIntegration,
            username: username,
            clientId: idCliente,
            secret: secret,
            originalSecret: originalSecret,
        };
        return (0, controllerThirdRequest_1.controllerThirdRequest)(req, res, next);
    }
    catch (error) {
        yield requestIntModel.createRequest({
            host,
            status: "error second request",
            validate: false,
            dateTimerequest: new Date(),
        });
        return res.status(500).json({ message: "Erro ao buscar cliente." });
    }
});
exports.controllerSecondRequest = controllerSecondRequest;
