import { query } from "../config/pool";
import { ixcModel } from "../model/IxcModel";
import { RequestHandler } from "express";

interface controllerIxcPayloadAttributes {
  name: string;
  host: string;
  secret: string;
  idToken: number;
}
const ixcInstModel = new ixcModel({
  id: 0,
  name: "",
  host: "",
  secret: "",
  idToken: 0,
  currentDate: new Date(),
});

export const controllerIxc = {
  register: (async (req, res, next) => {
    try {
      const { name, host, secret, idToken }: controllerIxcPayloadAttributes =
        req.body;

      if (
        typeof name !== "string" ||
        typeof host !== "string" ||
        typeof secret !== "string" ||
        typeof idToken !== "number"
      ) {
        return res
          .status(400)
          .json({ message: "Todos os campos são obrigatórios" });
      }
      const existingIntegrationName = await ixcInstModel.getIntegrationByName(
        name
      );
      const existingIntegrationSecret =
        await ixcInstModel.getIntegrationBySecre(secret);
      if (!existingIntegrationName || !existingIntegrationSecret) {
        const newIntegration = await ixcInstModel.createIntegration({
          name,
          host,
          secret,
          idToken,
        });
        return res.status(200).json(newIntegration);
      } else {
        return res.status(400).json({ error: "Integração já existente!" });
      }
    } catch (error) {
      next(error);
    }
  }) as RequestHandler,

  index: (async (req, res, next) => {
    try {
      const integrations = await ixcInstModel.getAllIntegrations();
      res.json({ data: integrations });
    } catch (error) {
      next(error);
    }
  }) as RequestHandler,

  show: (async (req, res, next) => {
    try {
      const { id } = req.params;
      const integration = await ixcInstModel.getIntegrationById(Number(id));
      if (!integration) {
        return res.status(404).json({ message: "Integração não encontrada" });
      }
      res.json({ data: integration });
    } catch (error) {
      next(error);
    }
  }) as RequestHandler,

  delete: (async (req, res, next) => {
    try {
      const { id } = req.params;
      const deleteIntegration = await ixcInstModel.getIntegrationById(
        Number(id)
      );
      if (!deleteIntegration) {
        return res.status(404).json({ error: "Integração não encontrada!" });
      }
      await query(`DELETE FROM integrations WHERE id = $1`, [id]);
      return res.json({
        data: `Integração deletada: ${deleteIntegration.name || "sem nome"}`,
      });
    } catch (error) {
      next(error);
    }
  }) as RequestHandler,
};
