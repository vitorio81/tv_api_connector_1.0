import { Response, NextFunction } from "express";
import { SecondRequestService } from "../services/ThirdRequestService ";
import { ThirdAccessRequestPayload } from "../model/ThirdAcessRequestPayload";
import { FourthRequesController } from "./ControllerFourthRequest";
import { requestModel } from "../model/RequestModel";

const requestIntModel = new requestModel({
  id: 0,
  host: "",
  status: "",
  validate: false,
  dateTimerequest: new Date(),
});

export class ThirdRequesController {
  public static async handleDirect(
    id: string,
    host: string,
    basicAuthToken: string,
    res: Response,
    next: NextFunction
  ) {
    try {
      const payload = ThirdAccessRequestPayload.create(
        id,
        basicAuthToken,
        host
      );
      const result = await SecondRequestService.request(payload);
      await requestIntModel.createRequest({
        host,
        status: "sucesso",
        validate: true,
        dateTimerequest: new Date(),
      });
      const idContrato = result.registros?.[0]?.id;
      await FourthRequesController.handleDirect(
        idContrato,
        host,
        basicAuthToken,
        res,
        next
      );
      return;
      
    } catch (error) {
      await requestIntModel.createRequest({
        host,
        status: `erro: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`,
        validate: false,
        dateTimerequest: new Date(),
      });
      res.status(500).json({
        error: "Falha na integração",
        details: error instanceof Error ? error.message : String(error),
        integrationHost: host,
      });
      next(error);
    }
  }
}
