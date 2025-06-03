"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThirdAccessRequestPayload = void 0;
const env_1 = require("../config/env");
class ThirdAccessRequestPayload {
    constructor(attributes) {
        this.data = attributes.data;
        this.headers = attributes.headers;
        this.url = attributes.url;
    }
    static create(id, basicAuthToken, host) {
        if (!env_1.config.typeSecondRequest)
            throw new Error("Type não configurado");
        const url = `${host.toLowerCase()}/${env_1.config.typeSecondRequest.toLowerCase()}`;
        const data = {
            qtype: "cliente_contrato.id_cliente",
            query: id,
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
exports.ThirdAccessRequestPayload = ThirdAccessRequestPayload;
