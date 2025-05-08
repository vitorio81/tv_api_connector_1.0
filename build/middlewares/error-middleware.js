"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = errorMiddleware;
const http_error_1 = require("../error/http_error");
function errorMiddleware(error, req, res, next) {
    if (error instanceof http_error_1.HttpError) {
        res.status(error.status).json({ message: error.message });
    }
    else {
        res.status(400).json({ message: error.message || "Erro desconhecido" });
    }
}
