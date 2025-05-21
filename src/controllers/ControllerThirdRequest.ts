import { RequestHandler } from "express";
import { SecondRequestService } from "../services/ThirdRequestService ";
import { ThirdAccessRequestPayload } from "../model/ThirdAcessRequestPayload";
import { requestModel } from "../model/RequestModel";
import { getIntegration } from "../services/IntegrationStore";

declare module "express-serve-static-core" {
  interface Request {
    nextAuthData?: {
      qtype: string;
      query: string;
      oper: string;
      get_id: string;
      token: string;
    };
  }
}

interface ThirdAccessRequestPayAttributes {
  qtype: string;
  query: string;
  oper: string;
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

export class ThirdRequesController {
  public static handle: RequestHandler = async (req, res, next) => {
    try {
      if (!req.nextAuthData) {
        res.status(400).json({ error: "Dados de autenticação ausentes!" });
        return;
      }

      const { query, token } =
        req.nextAuthData as ThirdAccessRequestPayAttributes;

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
        const payload = ThirdAccessRequestPayload.create(
          query,
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

        res.status(200).json(result);
      } catch (error) {
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
}
