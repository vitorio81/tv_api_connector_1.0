import { Response, NextFunction } from "express";
import { FourthRequestService } from "../services/FourthRequestService";
import { FourthAccessRequestPayload } from "../model/FourthAcessRequestPayload";
import { requestModel } from "../model/RequestModel";

const requestIntModel = new requestModel({
  id: 0,
  host: "",
  status: "",
  validate: false,
  dateTimerequest: new Date(),
});

export class FourthRequesController {
  public static async handleDirect(
    id: string,
    host: string,
    basicAuthToken: string,
    res: Response,
    next: NextFunction
  ) {
    try {
      const payload = FourthAccessRequestPayload.create(
        id,
        basicAuthToken,
        host
      );
      const result = await FourthRequestService.request(payload);

      await requestIntModel.createRequest({
        host,
        status: "sucesso",
        validate: true,
        dateTimerequest: new Date(),
      });

      // Validação robusta do retorno
      const registros = Array.isArray(result.registros)
        ? result.registros[0]
        : [];
      const planosNaTv = Array.isArray(registros)
        ? registros.filter(
            (item: any) =>
              typeof item.vd_contratos_produtos_descricao === "string" &&
              item.vd_contratos_produtos_descricao.startsWith("NaTv")
          )
        : [];

      const planosNaTvDescricao = planosNaTv.map(
        (item: any) => item.vd_contratos_produtos_descricao
      );

      return res.status(200).json(planosNaTvDescricao);
    } catch (error) {
      await requestIntModel.createRequest({
        host,
        status: `erro: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`,
        validate: false,
        dateTimerequest: new Date(),
      });
      // Só envia a resposta de erro, não chama next(error) após enviar resposta
      return res.status(500).json({
        error: "Falha na integração",
        details: error instanceof Error ? error.message : String(error),
        integrationHost: host,
      });
    }
  }
}
