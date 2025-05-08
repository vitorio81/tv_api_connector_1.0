import { Request, Response, NextFunction } from "express";
import axios from "axios";
import dotenv from "dotenv";
import { controllerFourthRequest } from "./controllerFourthRequest";
import { requestModel } from "../model/requestModel";
dotenv.config({ path: "/srv/tv_api_connector_1.0/.env" });

const TYPE_THIRD_REQUEST =
  process.env.TYPE_THIRD_REQUEST || "default_secret'key";

declare module "express-serve-static-core" {
  interface Request {
    integrationData?: {
      host: string;
      idIntegration?: number;
      username: string;
      clientId?: number;
      secret: string;
      id?: number;
      originalSecret: string;
    };
  }
}

const requestIntModel = new requestModel({
  id: 0,
  host: "",
  status: "",
  validate: false,
  dateTimerequest: new Date(),
});

interface ClienteResponse {
  registros: { id: number }[];
}

export const controllerThirdRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { host, idIntegration, username, clientId, secret, originalSecret } =
    req.integrationData!;

  try {
    const basicAuthToken = Buffer.from(`${idIntegration}:${secret}`).toString(
      "base64"
    );
    const url = `${host.toLowerCase()}/${TYPE_THIRD_REQUEST.toLowerCase()}`;
    const headers = {
      ixcsoft: "listar",
      "Content-Type": "application/json",
      Authorization: `Basic ${basicAuthToken}`,
    };
    const data = {
      qtype: "cliente_contrato.id_cliente",
      query: clientId,
      oper: "=",
    };

    const response = await axios.get(url, {
      headers,
      data,
    });
    const idContrato = response.data.registros[0].id;
    req.integrationData = {
      host: host,
      idIntegration: idIntegration,
      username: username,
      clientId: clientId,
      secret: secret,
      id: idContrato,
      originalSecret: originalSecret,
    };

    return controllerFourthRequest(req, res, next);
  } catch (error) {
    await requestIntModel.createRequest({
      host,
      status: "error third request",
      validate: false,
      dateTimerequest: new Date(),
    });
    if (axios.isAxiosError(error)) {
      console.error(
        "Erro na requisição:",
        error.response ? error.response.data : error.message
      );
    } else {
      console.error("Erro na requisição:", error);
    }
  }
};
