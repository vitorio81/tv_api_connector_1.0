"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authIntegration_1 = require("../controllers/authIntegration");
const authUserApi_1 = require("../controllers/authUserApi");
const apiAuth = express_1.default.Router();
apiAuth.post("/login/user", authUserApi_1.authUserApi.login);
apiAuth.post("/login/integretion", authIntegration_1.authIntegration.login);
exports.default = apiAuth;
