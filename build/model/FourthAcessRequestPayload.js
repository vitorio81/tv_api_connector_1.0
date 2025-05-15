"use strict";
// model/AccessRequestPayload.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.FourthAccessRequestPayload = void 0;
class FourthAccessRequestPayload {
    constructor(attributes) {
        this.data = attributes.data;
        this.headers = attributes.headers;
    }
    static create(get_id, basicAuthToken) {
        const data = {
            get_id: get_id,
        };
        const headers = {
            ixcsoft: "listar",
            Accept: "application/json",
            Authorization: `Basic ${basicAuthToken}`,
        };
        return { data, headers };
    }
}
exports.FourthAccessRequestPayload = FourthAccessRequestPayload;
