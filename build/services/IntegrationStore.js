"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setIntegration = setIntegration;
exports.getIntegration = getIntegration;
const integrationStore = new Map();
function setIntegration(id, host, secret) {
    integrationStore.set(id, { host, secret });
}
function getIntegration(id) {
    const data = integrationStore.get(id);
    return data || null;
}
