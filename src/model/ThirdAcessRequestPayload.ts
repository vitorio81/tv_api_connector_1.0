import { config } from "../config/env";
export interface AccessRequestData {
  qtype: string;
  query: string;
  oper: string;
}

export interface AccessRequestHeaders {
  ixcsoft: string;
  Accept: string;
  Authorization: string;
}

export interface AccessRequestPayloadType {
  data: AccessRequestData;
  headers: AccessRequestHeaders;
  url: string;
}

export class ThirdAccessRequestPayload {
  data: AccessRequestData;
  headers: AccessRequestHeaders;
  url: string;
  private constructor(attributes: AccessRequestPayloadType) {
    this.data = attributes.data;
    this.headers = attributes.headers;
    this.url = attributes.url;
  }
  static create(
    id: string,
    basicAuthToken: string,
    host: string
  ): AccessRequestPayloadType {
    if (!config.typeSecondRequest) throw new Error("Type não configurado");

    const url = `${host.toLowerCase()}/${config.typeSecondRequest.toLowerCase()}`;
    const data: AccessRequestData = {
      qtype: "cliente_contrato.id_cliente",
      query: id,
      oper: "=",
    };

    const headers: AccessRequestHeaders = {
      ixcsoft: "listar",
      Accept: "application/json",
      Authorization: `Basic ${basicAuthToken}`,
    };

    return { data, headers, url };
  }
}
