import { RequestHandler } from "express";
import { FourthRequestService } from "../services/FourthRequestService";
import { FourthAccessRequestPayload } from "../model/FourthAcessRequestPayload";
import { requestModel } from "../model/RequestModel";
import { getIntegration } from "../services/IntegrationStore";

declare module "express-serve-static-core" {
  interface Request {
    authData?: {
      username?: string;
      password?: string;
      token: string;
      get_id?: string;
    };
  }
}

interface FourthAccessRequestPayAttributes {
  get_id: string;
  token: string;
}


const requestIntModel = new requestModel({
  id: 0,
  host: "",
  status: "",
  validate: false,
  dateTimerequest: new Date(),
});

export class FourthRequesController {
  public static handle: RequestHandler = async (
    req: import("express").Request,
    res: import("express").Response,
    next: import("express").NextFunction
  ): Promise<void> => {
    try {
      if (!req.authData) {
        res.status(400).json({ error: "Dados de autenticação ausentes!" });
        return;
      }

      const { get_id, token } =
        req.authData as FourthAccessRequestPayAttributes;

      const integration = getIntegration(token);
      if (!integration) {
        res
          .status(404)
          .json({ error: "Integração não encontrada para esse token." });
        return;
      }
      const host = integration.host;
      const basicAuthToken = integration.secret;

      try {
        const payload = await FourthAccessRequestPayload.create(
          get_id,
          basicAuthToken,
          host
        );
        const result = await FourthRequestService.request(payload);
        console.log("Resultado da requisição:", result);

        await requestIntModel.createRequest({
          host: host,
          status: "sucesso",
          validate: true,
          dateTimerequest: new Date(),
        });
        console.log(result);
        res.status(200).json(result);
        return;
      } catch (error: unknown) {
        console.error("Erro na requisição:", error);

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
      }
    } catch (error) {
      console.error("Erro geral na controller:", error);
      next(error);
    }
  };
};
