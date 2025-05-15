import { RequestHandler } from "express";
import { ixcModel } from "../model/IxcModel";
import { SecondRequestService } from "../services/SecondRequestService ";
import { SecondAccessRequestPayload } from "../model/SecondAcessRequestPayload";
import { requestModel } from "../model/RequestModel";

declare module "express-serve-static-core" {
  interface Request {
    nextIntegrationData?: {
      qtype: string;
      query: string;
      oper: string;
      get_id: string;
    };
  }
}

interface SecondRequesPayloadAttributes {
  qtype: string;
  query: string;
  oper: string;
  get_id: string;
}

const ixcInstModel = new ixcModel({
  id: 0,
  name: "",
  host: "",
  secret: "",
  idToken: 0,
  currentDate: new Date(),
});

const requestIntModel = new requestModel({
  id: 0,
  host: "",
  status: "",
  validate: false,
  dateTimerequest: new Date(),
});

export class SecondRequesController {
  public static handle: RequestHandler = async (req, res, next) => {
    try {
      const { query } = req.nextAuthData as SecondRequesPayloadAttributes;
      const integrationList = await ixcInstModel.getAllIntegrations();

      if (!integrationList || integrationList.length === 0) {
        res.status(400).json({ error: "Nenhuma integração cadastrada" });
        return;
      }

      let lastError: any = null;

      for (const integration of integrationList) {
        try {
          const basicAuthToken = Buffer.from(
            `${integration.idToken}:${integration.secret}`
          ).toString("base64");
          console.log(basicAuthToken);
          console.log(integration.secret);

          const payload = SecondAccessRequestPayload.create(query, basicAuthToken);

          const result = await SecondRequestService.request(payload);

          await requestIntModel.createRequest({
            host: integration.host,
            status: "sucesso",
            validate: true,
            dateTimerequest: new Date(),
          });
          console.log(result);
          res.status(200).json(result);
          return; 
        } catch (error) {
          lastError = error;
          await requestIntModel.createRequest({
            host: integration.host,
            status: `erro: ${
              error instanceof Error ? error.message : "Erro desconhecido"
            }`,
            validate: false,
            dateTimerequest: new Date(),
          });
        }
      }

      res.status(500).json({
        error: "Todas as integrações falharam",
        details:
          lastError instanceof Error ? lastError.message : String(lastError),
        tried: integrationList.length,
      });
    } catch (error) {
      console.error("Erro geral na controller:", error);
      next(error); 
    }
  };
}