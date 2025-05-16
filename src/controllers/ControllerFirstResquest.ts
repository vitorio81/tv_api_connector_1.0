import { setIntegration } from "../services/IntegrationStore";
import { RequestHandler } from "express";
import { ixcModel } from "../model/IxcModel";
import { RequestService } from "../services/FirstRequestService";
import { AccessRequestPayload } from "../model/FirtsAcessRequestPayload";
import { requestModel } from "../model/RequestModel";

declare module "express-serve-static-core" {
  interface Request {
    integrationData?: {
      username: string;
      token: string
    };
  }
}

interface FirstRequestPayloadAttributes {
  username: string;
  token: string;
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
      console.log("Iniciando handle");
      const { username, token } = req.authData as FirstRequestPayloadAttributes;
      const integrationList = await ixcInstModel.getAllIntegrations();
      console.log(`Total de integrações: ${integrationList.length}`);

      if (!integrationList || integrationList.length === 0) {
        res.status(400).json({ error: "Nenhuma integração cadastrada" });
        return;
      }

      let lastError: any = null;

      for (const [index, integration] of integrationList.entries()) {
        try {
          console.log(
            `Processando integração ${index + 1}/${integrationList.length}: ${
              integration.host
            }`
          );

          const basicAuthToken = Buffer.from(
            `${integration.idToken}:${integration.secret}`
          ).toString("base64");

          console.log("Token gerado:", basicAuthToken);

          const host = integration.host;
          const payload = AccessRequestPayload.create(
            username,
            basicAuthToken,
            host
          );

          console.log("Payload antes da requisição:", payload);

          const result = await RequestService.request(payload);

          console.log("Resultado da requisição:", result);


          if (result?.total === 1) {
            await requestIntModel.createRequest({
              host: integration.host,
              status: "sucesso",
              validate: true,
              dateTimerequest: new Date(),
            });
            console.log("Resultado válido encontrado, retornando...");
           const host = integration.host
           const secret = basicAuthToken;
           const tokenId = token;
           setIntegration(tokenId, host, secret);
            res.status(200).json(result);
            return;
            
          }
        } catch (error) {
          console.error(`Erro na integração ${integration.host}:`, error);
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

      console.log("Todas as integrações foram processadas");
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
