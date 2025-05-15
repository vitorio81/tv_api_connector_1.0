"use strict";
// model/AccessRequestPayload.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecondAccessRequestPayload = void 0;
class SecondAccessRequestPayload {
    constructor(attributes) {
        this.data = attributes.data;
        this.headers = attributes.headers;
    }
    static create(query, basicAuthToken) {
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
        return { data, headers };
    }
}
exports.SecondAccessRequestPayload = SecondAccessRequestPayload;
