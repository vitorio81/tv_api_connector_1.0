import { userApiModel } from "../model/userApiModel";
import { RequestHandler } from "express";
import { controllerFirstResquest } from "./controllerFirstResquest";

interface authApiModelPayloadAttributes {
  username: string;
  secret: string;
  password: string;
}

const userInstModel = new userApiModel({
  id: 0,
  name: "",
  secret: "",
  endpoint: "",
  currentDate: new Date(),
});
export const authUserApi = {
  login: (async (req, res, next) => {
    try {
      const { secret, username, password }: authApiModelPayloadAttributes =
        req.body;
      const userSecret = await userInstModel.getUserBySecret(secret);
      if (!userSecret) {
        return res.status(404).json({ error: "Token inválido!" });
      }
      if (!username || !password) {
        return res
          .status(404)
          .json({ error: "Password ou username não encontrados!" });
      }
      await controllerFirstResquest(req, res, next);
    } catch (error) {
      next(error);
    }
  }) as RequestHandler,
};
