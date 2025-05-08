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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ixcModel = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "./.env" });
const pool_1 = require("../config_database/pool");
class ixcModel {
    constructor(attributes) {
        this.id = attributes.id;
        this.name = attributes.name;
        this.host = attributes.host;
        this.secret = attributes.secret;
        this.currentDate = attributes.currentDate;
    }
    getAllIntegrations() {
        return __awaiter(this, void 0, void 0, function* () {
            const { rows } = yield (0, pool_1.query)(`
      SELECT 
      id, name, host, secret, type, currentdate AS "currentDate"
      FROM integrations`);
            return rows;
        });
    }
    getIntegrationById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { rows } = yield (0, pool_1.query)(`
    SELECT 
    id, name, host, secret, type, currentdate AS "currentDate"
    FROM integrations WHERE id = $1
    `, [id]);
            return rows.length > 0 ? rows[0] : null;
        });
    }
    getIntegrationByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const { rows } = yield (0, pool_1.query)(`
      SELECT 
      id, name, host, secret, type, currentdate AS "currentDate"
      FROM integrations WHERE name = $1`, [name]);
            return rows[0];
        });
    }
    getUsersByPartialName(partialName) {
        return __awaiter(this, void 0, void 0, function* () {
            const { rows } = yield (0, pool_1.query)(`SELECT 
      id, name, contract, secret, currentdate AS "currentDate"
     FROM integrations
     WHERE name ILIKE $1`, [`%${partialName}%`]);
            return rows; // Retorna todos os usuários que contenham 'partialName' no nome
        });
    }
    getIntegrationBySecre(secret) {
        return __awaiter(this, void 0, void 0, function* () {
            const { rows } = yield (0, pool_1.query)(`
      SELECT 
      id, name, host, secret, type, currentdate AS "currentDate"
      FROM integrations WHERE secret = $1`, [secret]);
            return rows[0];
        });
    }
    createIntegration(attributes) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, host, secret } = attributes;
            const currentDate = new Date();
            const { rows } = yield (0, pool_1.query)(`INSERT INTO integrations (name, host, secret, currentdate) VALUES ($1, $2, $3, $4, $5) RETURNING id;`, [name, host, secret, currentDate]);
            const id = rows[0].id;
            const newIntegration = {
                id,
                name,
                host,
                secret,
                currentDate,
            };
            return newIntegration;
        });
    }
}
exports.ixcModel = ixcModel;
;
