import express from "express";
import {authUserApi} from "../services/AuthServiceFirtsRequest";
import {FirstRequestController} from "../controllers/ControllerFirstResquest";
import {secondAuthUserApi} from "../services/AuthServiceSecondRequest";
import {SecondRequestController} from "../controllers/ControllerSecondRequest";

const apiAuth = express.Router();

apiAuth.post("/auth", authUserApi.login, FirstRequestController.handle);
apiAuth.get("/auth", secondAuthUserApi.login, SecondRequestController.handle);


export default apiAuth;
