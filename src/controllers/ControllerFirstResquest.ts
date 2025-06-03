import { RequestHandler } from "express";
import { ixcModel } from "../model/IxcModel";
import { RequestService } from "../services/FirstRequestService";
import { AccessRequestPayload } from "../model/FirtsAcessRequestPayload";
import { requestModel } from "../model/RequestModel";

declare module "express-serve-static-core" {
  interface Request {
    authData?: {
      username?: string;
      password?: string;
    };
  }
}

interface FirstRequestPayloadAttributes {
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
      const { username, password } =
        req.authData as FirstRequestPayloadAttributes;
      const integrationList = await ixcInstModel.getAllIntegrations();

      if (!integrationList || integrationList.length === 0) {
        res.status(404).json({ error: "Nenhuma integração cadastrada" });
        return;
      }

      let usuarioEncontrado = false;

      for (const integration of integrationList) {
        try {
          const basicAuthToken = Buffer.from(
            `${integration.idToken}:${integration.secret}`
          ).toString("base64");

          const payload = AccessRequestPayload.create(
            username,
            basicAuthToken,
            integration.host
          );

          const result = await RequestService.request(payload);

          // Usuário encontrado
          if (result?.total === 1) {
            usuarioEncontrado = true;
            const senhaUser = result.registros?.[0]?.senha;
            // Senha correta
            if (senhaUser === password) {
              await requestIntModel.createRequest({
                host: integration.host,
                status: "sucesso",
                validate: true,
                dateTimerequest: new Date(),
              });
              res.status(200).json("Usuário autorizado");
              return;
            } else {
              // Senha incorreta
              await requestIntModel.createRequest({
                host: integration.host,
                status: "não autorizado",
                validate: false,
                dateTimerequest: new Date(),
              });
              res.status(401).json({ error: "Usuário não autorizado" });
              return;
            }
          }
        } catch (error) {
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

      // Se não encontrou usuário em nenhuma integração
      if (!usuarioEncontrado) {
        res.status(404).json({ error: "Usuário inexistente" });
      }
    } catch (error) {
      next(error);
    }
  };
}
