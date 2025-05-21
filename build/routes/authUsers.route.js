"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ControllerFirstResquest_1 = require("../controllers/ControllerFirstResquest");
const ControllerThirdRequest_1 = require("../controllers/ControllerThirdRequest");
const ControllerFourthRequest_1 = require("../controllers/ControllerFourthRequest");
const ControllerSecondRequest_1 = require("../controllers/ControllerSecondRequest");
const AuthServiceFirtsRequest_1 = require("../services/AuthServiceFirtsRequest");
const AuthServiceNextRequest_1 = require("../services/AuthServiceNextRequest");
const apiAuth = express_1.default.Router();
apiAuth.get("/ixc.standard.central.vd_contrato_produto", AuthServiceFirtsRequest_1.authUserApi.login, ControllerFirstResquest_1.FirstRequestController.handle);
apiAuth.post("/webservice/v1/cliente", AuthServiceNextRequest_1.nextAuthUserApi.login, ControllerSecondRequest_1.SecondRequestController.handle);
apiAuth.post("/webservice/v1/cliente_contrato", AuthServiceNextRequest_1.nextAuthUserApi.login, ControllerThirdRequest_1.ThirdRequesController.handle);
apiAuth.post("/webservice/v1/cliente_contrato_retornar_produtos_contrato_28145", AuthServiceNextRequest_1.nextAuthUserApi.login, ControllerFourthRequest_1.FourthRequesController.handle);
exports.default = apiAuth;
