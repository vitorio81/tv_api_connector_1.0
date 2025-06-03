"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthServiceFirtsRequest_1 = require("../services/AuthServiceFirtsRequest");
const ControllerFirstResquest_1 = require("../controllers/ControllerFirstResquest");
const AuthServiceSecondRequest_1 = require("../services/AuthServiceSecondRequest");
const ControllerSecondRequest_1 = require("../controllers/ControllerSecondRequest");
const apiAuth = express_1.default.Router();
apiAuth.post("/auth", AuthServiceFirtsRequest_1.authUserApi.login, ControllerFirstResquest_1.FirstRequestController.handle);
apiAuth.get("/auth", AuthServiceSecondRequest_1.secondAuthUserApi.login, ControllerSecondRequest_1.SecondRequestController.handle);
exports.default = apiAuth;
