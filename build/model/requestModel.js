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
exports.requestModel = void 0;
const pool_1 = require("../config_database/pool");
class requestModel {
    constructor(attributes) {
        this.id = attributes.id;
        this.host = attributes.host;
        this.status = attributes.status;
        this.validate = attributes.validate;
        this.dateTimerequest = attributes.dateTimerequest;
    }
    getAllRequests() {
        return __awaiter(this, void 0, void 0, function* () {
            const { rows } = yield (0, pool_1.query)(`
      SELECT 
      id, host, status, validate, datetimerequest AS "dateTimerequest"
      FROM requests`);
            return rows;
        });
    }
    getRequestById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { rows } = yield (0, pool_1.query)(`
      SELECT 
      id, host, status, validate, datetimerequest AS "dateTimerequest"
      FROM requests WHERE id = $1`, [id]);
            return rows[0];
        });
    }
    getRequestByHosts(partialHosts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { rows } = yield (0, pool_1.query)(`
      SELECT 
      id, host, status, validate, datetimerequest AS "dateTimerequest"
      FROM requests WHERE host ILIKE $1`, [`%${partialHosts}%`]);
            return rows;
        });
    }
    getRequestByStatus(partialSattus) {
        return __awaiter(this, void 0, void 0, function* () {
            const { rows } = yield (0, pool_1.query)(`SELECT 
     id, host, status, validate, datetimerequest AS "dateTimerequest"
     FROM requests
     WHERE name ILIKE $1`, [`%${partialSattus}%`]);
            return rows; // Retorna todos os usuários que contenham 'partialName' no nome
        });
    }
    createRequest(attributes) {
        return __awaiter(this, void 0, void 0, function* () {
            const { host, status, validate } = attributes;
            const dateTimerequest = new Date();
            const { rows } = yield (0, pool_1.query)(`INSERT INTO requests (host, status, validate, datetimerequest) VALUES ($1, $2, $3, $4)RETURNING id;`, [host, status, validate, dateTimerequest]);
            const id = rows[0].id;
            const newRequest = {
                id,
                host,
                status,
                validate,
                dateTimerequest,
            };
            return newRequest;
        });
    }
}
exports.requestModel = requestModel;
