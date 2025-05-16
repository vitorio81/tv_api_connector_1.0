"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecondAccessRequestPayload = void 0;
const env_1 = require("../config/env");
class SecondAccessRequestPayload {
    constructor(attributes) {
        this.data = attributes.data;
        this.headers = attributes.headers;
        this.url = attributes.url;
    }
    static create(query, basicAuthToken, host) {
        if (!env_1.config.typeSecondRequest)
            throw new Error("Type não configurado");
        const url = `${host.toLowerCase()}/${env_1.config.typeSecondRequest.toLowerCase()}`;
        const data = {
            qtype: "cliente_contrato.id_cliente",
            query: query,
            oper: "=",
        };
        const headers = {
            ixcsoft: "listar",
            Accept: "application/json",
            Authorization: `Basic ${basicAuthToken}`,
        };
        return { data, headers, url };
    }
}
exports.SecondAccessRequestPayload = SecondAccessRequestPayload;
