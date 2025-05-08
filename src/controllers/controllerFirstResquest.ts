import axios from "axios";
import { Request, Response, NextFunction } from "express";
import {ixcModel} from "../model/ixcModel";
import { controllerSecondRequest } from "./controllerSecondRequest";
import dotenv from "dotenv";;
import { url } from "inspector";
import { requestModel } from "../model/requestModel";
dotenv.config({ path: "/srv/tv_api_connector_1.0/.env" });

const TYPE_FIRST_REQUEST =
  process.env.TYPE_FIRST_REQUEST || "default_secret_key"; 
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

interface firstRequestPayloadAttributes {
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
  currentDate: new Date,
})
const requestIntModel = new requestModel({
  id: 0,
  host: "",
  status: "",
  validate: false,
  dateTimerequest: new Date(),
});

interface ClienteResponse {
  registros: { senha: string }[];
}


export const controllerFirstResquest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    const {
    host,
    secret: originalSecret,
    username,
    password,
  } = req.body as firstRequestPayloadAttributes;

  try {
    const integrationList = await ixcInstModel.getAllIntegrations();
    for (let integration of integrationList) {
      try {
        console.log("Tentando integração com:", integration.host);
        console.log("secret:", integration.secret);
        console.log("token:", integration.idToken);
        const host = integration.host;
        const url = `${host.toLowerCase()}/${TYPE_FIRST_REQUEST.toLowerCase()}`;
        const idIntegration = integration.idToken;
        const secret = integration.secret;
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

        const senhaCliente = response.data.registros[0].senha;
        console.log("Senha do cliente:", senhaCliente);
        if (senhaCliente === password) {
           req.integrationData = {
             host: integration.host,
             idIntegration: integration.idToken,
             username,
             secret: integration.secret,
             originalSecret: originalSecret,
           };
          return controllerSecondRequest(req, res, next);
        } else {
           await requestIntModel.createRequest({
             host,
             status: "sucesso",
             validate: false,
             dateTimerequest: new Date(),
           });
          return res.status(200).json({
            host: HOST,
            type: TYPE_LOGIN_USER,
            secret: originalSecret,
            username,
            validate: false,
            message: "Senha ou usuário inválido.",
          });
        }
    
      } catch (error) {
        console.error(
          `Erro ao tentar integração com ${url}:`,
          axios.isAxiosError(error)
            ? error.response?.data
            : (error as Error).message
        );
        await requestIntModel.createRequest({
          host,
          status: "erro",
          validate: false,
          dateTimerequest: new Date(),
        });
      }
    }

     await requestIntModel.createRequest({
       host,
       status: "sucesso",
       validate: false,
       dateTimerequest: new Date(),
     });
     
    return res.status(200).json({
      host: HOST,
      type: TYPE_LOGIN_USER,
      secret: originalSecret,
      username,
      validate: false,
      message: "Cliente não encontrado",
    });
    
  } catch (error) {
   
    next(error);
  }
};
