import axios from "axios";
import { RequestHandler } from "express";
import { ixcModel } from "../model/IxcModel";
import { config } from "../config/env";
import { RequestService } from "../services/FirstRequestService";
import { AccessRequestPayload } from "../model/FirtsAcessRequestPayload";
import { requestModel } from "../model/RequestModel";

declare module "express-serve-static-core" {
  interface Request {
    integrationData?: {
      host: string;
      username: string;
      password: string;
      secret: string;
      id: string;
    };
  }
}

interface FirstRequestPayloadAttributes {
  host: string;
  secret: string;
  username: string;
  password: string;
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

export class FirstRequestController {
  public static handle: RequestHandler = async (req, res, next) => {
    try {
      const { username } = req.authData as FirstRequestPayloadAttributes;
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

          const payload = AccessRequestPayload.create(username, basicAuthToken);

          const result = await RequestService.request(payload);

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
