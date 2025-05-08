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
exports.controllerFourthRequest = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const requestModel_1 = require("../model/requestModel");
dotenv_1.default.config({ path: "/srv/tv_api_connector/.env" });
const TYPE_FOURTH_REQUEST = process.env.TYPE_FOURTH_REQUEST || "default_secret_key";
const TYPE_LOGIN_USER = process.env.TYPE_LOGIN_USER || "default_secret_key";
const HOST = process.env.HOST || "default_secret_key";
const requestIntModel = new requestModel_1.requestModel({
    id: 0,
    host: "",
    status: "",
    validate: false,
    dateTimerequest: new Date(),
});
const controllerFourthRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { host, idIntegration, username, secret, clientId, id, originalSecret, } = req.integrationData;
    try {
        const url = `${host.toLowerCase()}/${TYPE_FOURTH_REQUEST.toLowerCase()}`;
        const basicAuthToken = Buffer.from(`${idIntegration}:${secret}`).toString("base64");
        const headers = {
            ixcsoft: "listar",
            "Content-Type": "application/json",
            Authorization: `Basic ${basicAuthToken}`,
        };
        const data = {
            get_id: id,
        };
        const response = yield axios_1.default.get(url, {
            headers,
            data,
        });
        console.log(host, username, secret, clientId, id);
        const registrosRaw = response.data.registros[0];
        const registros = registrosRaw;
        const registroNaTvFull = registros.find((item) => item.vd_contratos_produtos_descricao.startsWith("NaTv"));
        console.log("Plano Tv:", registroNaTvFull === null || registroNaTvFull === void 0 ? void 0 : registroNaTvFull.vd_contratos_produtos_descricao);
        if (registroNaTvFull) {
            const planoTv = registroNaTvFull.vd_contratos_produtos_descricao;
            const planoTvJson = {
                plano: planoTv
            };
            yield requestIntModel.createRequest({
                host,
                status: "sucesso",
                validate: true,
                dateTimerequest: new Date(),
            });
            return res.status(200).json({
                host: HOST,
                type: TYPE_LOGIN_USER,
                secret: originalSecret,
                username,
                validate: true,
                planoTvJson
            });
        }
        else {
            yield requestIntModel.createRequest({
                host,
                status: "Not flat",
                validate: false,
                dateTimerequest: new Date(),
            });
            return res.status(404).json({ message: "Plano de TV não encontrado." });
        }
    }
    catch (error) {
        console.error("Erro na Quarta requisição:", error);
        yield requestIntModel.createRequest({
            host,
            status: "error fourth request",
            validate: false,
            dateTimerequest: new Date(),
        });
        return res.status(500).json({ message: "Erro ao buscar cliente." });
    }
});
exports.controllerFourthRequest = controllerFourthRequest;
