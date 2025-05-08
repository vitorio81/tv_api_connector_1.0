import express from "express";
import { controllerIxc } from "../controllers/controllerIxc";
import { controllerUser } from "../controllers/controllerUser";
import { controllerRequest } from "../controllers/controllerRequest";
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
