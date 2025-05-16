import { config } from "../config/env";
export interface AccessRequestData {
  get_id: string;
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

export class FourthAccessRequestPayload {
  data: AccessRequestData;
  headers: AccessRequestHeaders;
  url : string
  private constructor(attributes: AccessRequestPayloadType) {
    this.data = attributes.data;
    this.headers = attributes.headers;
    this.url = attributes.url;
  }
  static create(
    get_id: string,
    basicAuthToken: string,
    host: string
  ): AccessRequestPayloadType {
    if (!config.typeFourthRequest) throw new Error("Type não configurado");
    const url = `${host.toLowerCase()}/${config.typeFourthRequest.toLowerCase()}`;
    const data: AccessRequestData = {
      get_id: get_id,
    };

    const headers: AccessRequestHeaders = {
      ixcsoft: "listar",
      Accept: "application/json",
      Authorization: `Basic ${basicAuthToken}`,
    };

    return { data, headers, url };
  }
}
