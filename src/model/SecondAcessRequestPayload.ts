import { config } from "../config/env";

export interface AccessRequestData {
  qtype: string;
  query: string;
  oper: string;
  page: string;
  rp: string;
  sortname: string;
  sortorder: string;
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

export class AccessRequestPayload {
  data: AccessRequestData;
  headers: AccessRequestHeaders;
  url: string;
  private constructor(attributes: AccessRequestPayloadType) {
    this.data = attributes.data;
    this.headers = attributes.headers;
    this.url = attributes.url;
  }
  static create(
    username: string,
    basicAuthToken: string,
    host: string
  ): AccessRequestPayloadType {
    if (!config.typeFirtsRequest) throw new Error("Type não configurado");
    const url = `${host.toLowerCase()}/${config.typeFirtsRequest.toLowerCase()}`;
    const data: AccessRequestData = {
      qtype: "cliente.hotsite_email",
      query: username,
      oper: "=",
      page: "1",
      rp: "20",
      sortname: "cliente.id",
      sortorder: "desc",
    };

    const headers: AccessRequestHeaders = {
      ixcsoft: "listar",
      Accept: "application/json",
      Authorization: `Basic ${basicAuthToken}`,
    };

    return { data, headers, url };
  }
}
