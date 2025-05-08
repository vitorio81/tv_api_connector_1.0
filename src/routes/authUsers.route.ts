import express from "express";
import { authIntegration } from "../controllers/authIntegration";
import { authUserApi } from "../controllers/authUserApi";
const apiAuth = express.Router();

apiAuth.post("/login/user", authUserApi.login);
apiAuth.post("/login/integretion", authIntegration.login);

export default apiAuth;
