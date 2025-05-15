// model/AccessRequestPayload.ts

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
}

export class FourthAccessRequestPayload {
  data: AccessRequestData;
  headers: AccessRequestHeaders;
  private constructor(attributes: AccessRequestPayloadType) {
    this.data = attributes.data;
    this.headers = attributes.headers;
  }
  static create(
    get_id: string,
    basicAuthToken: string
  ): AccessRequestPayloadType {
    const data: AccessRequestData = {
      get_id: get_id,
    };

    const headers: AccessRequestHeaders = {
      ixcsoft: "listar",
      Accept: "application/json",
      Authorization: `Basic ${basicAuthToken}`,
    };

    return { data, headers };
  }
}
