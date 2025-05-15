"use strict";
// model/AccessRequestPayload.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessRequestPayload = void 0;
class AccessRequestPayload {
    constructor(attributes) {
        this.data = attributes.data;
        this.headers = attributes.headers;
    }
    static create(username, basicAuthToken) {
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
        return { data, headers };
    }
}
exports.AccessRequestPayload = AccessRequestPayload;
