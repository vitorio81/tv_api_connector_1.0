// model/AccessRequestPayload.ts

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
}

export class SecondAccessRequestPayload {
  data: AccessRequestData;
  headers: AccessRequestHeaders;
  private constructor(attributes: AccessRequestPayloadType) {
    this.data = attributes.data;
    this.headers = attributes.headers;
  }
  static create(
    query: string,
    basicAuthToken: string
  ): AccessRequestPayloadType {
    const data: AccessRequestData = {
      qtype: "cliente_contrato.id_cliente",
      query: query,
      oper: "=",
    };

    const headers: AccessRequestHeaders = {
      ixcsoft: "listar",
      Accept: "application/json",
      Authorization: `Basic ${basicAuthToken}`,
    };

    return { data, headers };
  }
}
