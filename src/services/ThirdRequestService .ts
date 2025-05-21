import axios from "axios";
import { ThirdAccessRequestPayload } from "../model/ThirdAcessRequestPayload";

export class SecondRequestService {
  static async request(payload: ThirdAccessRequestPayload) {
    try {
      const response = await axios.get(payload.url, {
        headers: payload.headers as unknown as Record<string, string>,
        data: payload.data,
      });
      console.log(payload.headers);

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
