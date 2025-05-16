"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FourthAccessRequestPayload = void 0;
const env_1 = require("../config/env");
class FourthAccessRequestPayload {
    constructor(attributes) {
        this.data = attributes.data;
        this.headers = attributes.headers;
        this.url = attributes.url;
    }
    static create(get_id, basicAuthToken, host) {
        if (!env_1.config.typeFourthRequest)
            throw new Error("Type não configurado");
        const url = `${host.toLowerCase()}/${env_1.config.typeFourthRequest.toLowerCase()}`;
        const data = {
            get_id: get_id,
        };
        const headers = {
            ixcsoft: "listar",
            Accept: "application/json",
            Authorization: `Basic ${basicAuthToken}`,
        };
        return { data, headers, url };
    }
}
exports.FourthAccessRequestPayload = FourthAccessRequestPayload;
