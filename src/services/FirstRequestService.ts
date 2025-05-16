import axios from "axios";
import { AccessRequestPayload } from "../model/FirtsAcessRequestPayload";

export class RequestService {
  static async request(payload: AccessRequestPayload) {
    try {
      const response = await axios.post(payload.url, payload.data, {
        headers: payload.headers as unknown as Record<string, string>,
      });
      console.log(payload.headers);
      console.log(payload.url)
      console.log(payload)

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Detalhes do erro IXC:", {
          url: payload.url,
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
