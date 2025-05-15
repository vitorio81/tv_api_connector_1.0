import express from "express";
import { FirstRequestController } from "../controllers/ControllerFirstResquest";
import { SecondRequesController } from "../controllers/ControllerSecondRequest"
import { FourthRequesController } from "../controllers/ControllerFourthRequest";
import { authUserApi } from "../services/AuthServiceFirtsRequest";
import { nextAuthUserApi } from "../services/AuthServiceNextRequest";
const apiAuth = express.Router();

apiAuth.get(
  "/ixc.standard.central.vd_contrato_produto", authUserApi.login,
  FirstRequestController.handle
);
apiAuth.get(
  "/webservice/v1/cliente_contrato",
  nextAuthUserApi.login, SecondRequesController.handle
);
apiAuth.get(
  "/webservice/v1/cliente_contrato_retornar_produtos_contrato_28145", nextAuthUserApi.login,
  FourthRequesController.handle
);


export default apiAuth;
