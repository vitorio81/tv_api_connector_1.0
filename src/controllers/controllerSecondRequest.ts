import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import axios from "axios";
import { controllerThirdRequest } from "./controllerThirdRequest";
import { requestModel } from "../model/requestModel";
dotenv.config({ path: "/srv/tv_api_connector_1.0/.env" });

const TYPE_SECOND_REQUEST =
  process.env.TYPE_SECOND_REQUEST || "default_secret_key";

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

export const controllerSecondRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { host, idIntegration, username, secret, originalSecret } =
    req.integrationData!;

  try {
    const url = `${host.toLowerCase()}/${TYPE_SECOND_REQUEST.toLowerCase()}`;
    const basicAuthToken = Buffer.from(`${idIntegration}:${secret}`).toString(
      "base64"
    );
    const headers = {
      ixcsoft: "listar",
      "Content-Type": "application/json",
      Authorization: `Basic ${basicAuthToken}`,
    };

    const data = {
      qtype: "cliente.hotsite_email",
      query: username,
      oper: "=",
      page: "1",
      rp: "20",
      sortname: "cliente.id",
      sortorder: "desc",
    };
    const response = await axios.get<ClienteResponse>(`${url}`, {
      headers,
      data,
    });

    const idCliente = response.data.registros[0].id;

    req.integrationData = {
      host: host,
      idIntegration: idIntegration,
      username: username,
      clientId: idCliente,
      secret: secret,
      originalSecret: originalSecret,
    };

    return controllerThirdRequest(req, res, next);
  } catch (error) {
    await requestIntModel.createRequest({
      host,
      status: "error second request",
      validate: false,
      dateTimerequest: new Date(),
    });
    return res.status(500).json({ message: "Erro ao buscar cliente." });
  }
};
