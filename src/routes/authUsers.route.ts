import express from "express";
import { FirstRequestController } from "../controllers/ControllerFirstResquest";
import { ThirdRequesController } from "../controllers/ControllerThirdRequest";
import { FourthRequesController } from "../controllers/ControllerFourthRequest";
import { SecondRequestController } from "../controllers/ControllerSecondRequest";
import { authUserApi } from "../services/AuthServiceFirtsRequest";
import { nextAuthUserApi } from "../services/AuthServiceNextRequest";
const apiAuth = express.Router();

apiAuth.get(
  "/ixc.standard.central.vd_contrato_produto", authUserApi.login,
  FirstRequestController.handle
);
apiAuth.post(
  "/webservice/v1/cliente",
  nextAuthUserApi.login,
  SecondRequestController.handle
);
apiAuth.post(
  "/webservice/v1/cliente_contrato",
  nextAuthUserApi.login,
  ThirdRequesController.handle
);
apiAuth.post(
  "/webservice/v1/cliente_contrato_retornar_produtos_contrato_28145", nextAuthUserApi.login,
  FourthRequesController.handle
);


export default apiAuth;
