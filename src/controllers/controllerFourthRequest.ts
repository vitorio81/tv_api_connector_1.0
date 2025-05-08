import { Request, Response, NextFunction } from "express";
import axios from "axios";
import dotenv from "dotenv";
import { requestModel } from "../model/requestModel";
dotenv.config({ path: "/srv/tv_api_connector_1.0/.env" });

const TYPE_FOURTH_REQUEST =
  process.env.TYPE_FOURTH_REQUEST || "default_secret_key";
const TYPE_LOGIN_USER = process.env.TYPE_LOGIN_USER || "default_secret_key";
const HOST = process.env.HOST || "default_secret_key";

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

interface Registro {
  vd_contratos_produtos_descricao: string;
  [key: string]: any;
}

export const controllerFourthRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    host,
    idIntegration,
    username,
    secret,
    clientId,
    id,
    originalSecret,
  } = req.integrationData!;

  try {
    const url = `${host.toLowerCase()}/${TYPE_FOURTH_REQUEST.toLowerCase()}`;
    const basicAuthToken = Buffer.from(`${idIntegration}:${secret}`).toString(
      "base64"
    );
    const headers = {
      ixcsoft: "listar",
      "Content-Type": "application/json",
      Authorization: `Basic ${basicAuthToken}`,
    };
    const data = {
      get_id: id,
    };

    const response = await axios.get(url, {
      headers,
      data,
    });

    console.log(host, username, secret, clientId, id);
    const registrosRaw = response.data.registros[0];

    const registros: Registro[] = registrosRaw as Registro[];
    const registroNaTvFull = registros.find((item) =>
      item.vd_contratos_produtos_descricao.startsWith("NaTv")
    );

    console.log("Plano Tv:", registroNaTvFull?.vd_contratos_produtos_descricao);

    if (registroNaTvFull) {
      const planoTv = registroNaTvFull.vd_contratos_produtos_descricao;
      const planoTvJson: {[key: string]: string} ={
        plano: planoTv
      }
      await requestIntModel.createRequest({
             host,
             status: "sucesso",
             validate: true,
             dateTimerequest: new Date(),
      })
      return res.status(200).json({
        host: HOST,
        type: TYPE_LOGIN_USER,
        secret: originalSecret,
        username,
        validate: true,
        planoTvJson
      });
    } else {
      await requestIntModel.createRequest({
             host,
             status: "Not flat",
             validate: false,
             dateTimerequest: new Date(),
      })
      return res.status(404).json({ message: "Plano de TV não encontrado." });
    }
  } catch (error) {
    console.error("Erro na Quarta requisição:", error);
    await requestIntModel.createRequest({
      host,
      status: "error fourth request",
      validate: false,
      dateTimerequest: new Date(),
    });
    return res.status(500).json({ message: "Erro ao buscar cliente." });
    
  }
};
