import express from "express";
import { authUserApi } from "../services/AuthServiceFirtsRequest";
import { nextAuthUserApi } from "../services/AuthServiceNextRequest";
import { FirstRequestController } from "../controllers/ControllerFirstResquest";
import { SecondRequestController } from "../controllers/ControllerSecondRequest";
import { ThirdRequesController } from "../controllers/ControllerThirdRequest";
import { FourthRequesController } from "../controllers/ControllerFourthRequest";

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
apiAuth.get(
  "/webservice/v1/cliente_contrato_retornar_produtos_contrato_28145",
  authUserApi.login,
  FourthRequesController.handle
);


export default apiAuth;
