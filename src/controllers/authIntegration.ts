import { ixcModel } from "../model/ixcModel";
import { RequestHandler } from "express";

interface authIntegrationPayloadAttributes {
  secret: string;
}

const integrationsModel = new ixcModel({
  id: 0,
  name: "",
  host: "",
  secret: "",
  idToken: 0,
  currentDate: new Date(),
});

export const authIntegration = {
  login: (async (req, res, next) => {
    try {
      const { secret }: authIntegrationPayloadAttributes = req.body;
      const integrationSecret = await integrationsModel.getIntegrationBySecre(
        secret
      );
      if (!integrationSecret) {
        return res
          .status(404)
          .json({ message: "Não esxite nenhuma integração Cadastrada" });
      } else {
        return res.status(200).json({ message: "Integração autorizada!" });
      }
    } catch (error) {
      next(error);
    }
  }) as RequestHandler,
};
