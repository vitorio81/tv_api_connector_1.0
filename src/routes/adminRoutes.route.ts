import express from "express";
import { controllerIxc } from "../controllers/ControllerIxc";
import { controllerUser } from "../controllers/ControllerUser";
import { controllerRequest } from "../controllers/ControllerRequest";
const adminRouters = express.Router();

adminRouters.post("/register/integretion", controllerIxc.register);

adminRouters.post("/register/user", controllerUser.register);

adminRouters.get("/integrations", controllerIxc.index);

adminRouters.get("/users", controllerUser.index);

adminRouters.get("/integration/:id", controllerIxc.show);

adminRouters.delete("/integrations/:id", controllerIxc.delete);

adminRouters.delete("/users/:id", controllerUser.delete);

adminRouters.get("/requests", controllerRequest.index);

export default adminRouters;
