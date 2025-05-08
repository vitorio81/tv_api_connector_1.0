import { RequestHandler } from "express";
import { requestModel } from "../model/requestModel";

const requestIntModel = new requestModel({
  id: 0,
  host: "",
  status: "",
  validate: false,
  dateTimerequest: new Date(),
});
export const controllerRequest = {
  index: (async (req, res, next) => {
    const admin = req.admin;
    try {
      const request = await requestIntModel.getAllRequests();
      return res.json({
        data: request,
        adminEmail: admin ? admin.email : null,
      });
    } catch (error) {
      next(error);
    }
  }) as RequestHandler,
};
