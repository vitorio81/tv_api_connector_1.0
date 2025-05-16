"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessRequestPayload = void 0;
const env_1 = require("../config/env");
class AccessRequestPayload {
    constructor(attributes) {
        this.data = attributes.data;
        this.headers = attributes.headers;
        this.url = attributes.url;
    }
    static create(username, basicAuthToken, host) {
        if (!env_1.config.typeFirtsRequest)
            throw new Error("Type não configurado");
        const url = `${host.toLowerCase()}/${env_1.config.typeFirtsRequest.toLowerCase()}`;
        const data = {
            qtype: "cliente.hotsite_email",
            query: username,
            oper: "=",
            page: "1",
            rp: "20",
            sortname: "cliente.id",
            sortorder: "desc",
        };
        const headers = {
            ixcsoft: "listar",
            Accept: "application/json",
            Authorization: `Basic ${basicAuthToken}`,
        };
        return { data, headers, url };
    }
}
exports.AccessRequestPayload = AccessRequestPayload;
