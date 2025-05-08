"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authAdmin_1 = require("../controllers/authAdmin");
const adminAuthRoute = express_1.default.Router();
adminAuthRoute.post("/register", authAdmin_1.authAdmin.register);
adminAuthRoute.post("/login", authAdmin_1.authAdmin.login);
exports.default = adminAuthRoute;
