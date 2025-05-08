"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.controllerRequest = void 0;
const requestModel_1 = require("../model/requestModel");
const requestIntModel = new requestModel_1.requestModel({
    id: 0,
    host: "",
    status: "",
    validate: false,
    dateTimerequest: new Date(),
});
exports.controllerRequest = {
    index: ((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const admin = req.admin;
        try {
            const request = yield requestIntModel.getAllRequests();
            return res.json({
                data: request,
                adminEmail: admin ? admin.email : null,
            });
        }
        catch (error) {
            next(error);
        }
    })),
};
