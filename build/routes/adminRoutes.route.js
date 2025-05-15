"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ControllerIxc_1 = require("../controllers/ControllerIxc");
const ControllerUser_1 = require("../controllers/ControllerUser");
const ControllerRequest_1 = require("../controllers/ControllerRequest");
const adminRouters = express_1.default.Router();
adminRouters.post("/register/integretion", ControllerIxc_1.controllerIxc.register);
adminRouters.post("/register/user", ControllerUser_1.controllerUser.register);
adminRouters.get("/integrations", ControllerIxc_1.controllerIxc.index);
adminRouters.get("/users", ControllerUser_1.controllerUser.index);
adminRouters.get("/integration/:id", ControllerIxc_1.controllerIxc.show);
adminRouters.delete("/integrations/:id", ControllerIxc_1.controllerIxc.delete);
adminRouters.delete("/users/:id", ControllerUser_1.controllerUser.delete);
adminRouters.get("/requests", ControllerRequest_1.controllerRequest.index);
exports.default = adminRouters;
