"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllerIxc_1 = require("../controllers/controllerIxc");
const controllerUser_1 = require("../controllers/controllerUser");
const controllerRequest_1 = require("../controllers/controllerRequest");
const adminRouters = express_1.default.Router();
adminRouters.post("/register/integretion", controllerIxc_1.controllerIxc.register);
adminRouters.post("/register/user", controllerUser_1.controllerUser.register);
adminRouters.get("/integrations", controllerIxc_1.controllerIxc.index);
adminRouters.get("/users", controllerUser_1.controllerUser.index);
adminRouters.get("/integration/:id", controllerIxc_1.controllerIxc.show);
adminRouters.delete("/integrations/:id", controllerIxc_1.controllerIxc.delete);
adminRouters.delete("/users/:id", controllerUser_1.controllerUser.delete);
adminRouters.get("/requests", controllerRequest_1.controllerRequest.index);
exports.default = adminRouters;
