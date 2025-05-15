import { config } from "../config/env";
import axios from "axios";
import { AccessRequestPayload } from "../model/FirtsAcessRequestPayload";

export class RequestService {
  static async request(payload: AccessRequestPayload) {
    if (!config.hostIntegration) throw new Error("Host não configurado");
    if (!config.typeFirtsRequest) throw new Error("Type não configurado");

    const url = `${config.hostIntegration.toLowerCase()}/${config.typeFirtsRequest.toLowerCase()}`;

    try {
      const response = await axios.get(url, {
        headers: payload.headers as unknown as Record<string, string>,
        data: payload.data,
      });
      console.log(payload.headers);

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Detalhes do erro IXC:", {
          url,
          status: error.response?.status,
          data: error.response?.data,
          config: error.config,
        });
      }
      throw new Error(
        `Falha na requisição: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  }
}
