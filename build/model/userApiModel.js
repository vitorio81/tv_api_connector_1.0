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
exports.UserApiModel = void 0;
const env_1 = require("../config/env");
const pool_1 = require("../config/pool");
class UserApiModel {
    constructor(attributes) {
        this.id = attributes.id;
        this.name = attributes.name;
        this.ip = attributes.ip;
        this.endpoint = attributes.endpoint;
        this.currentDate = attributes.currentDate;
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const { rows } = yield (0, pool_1.query)(`SELECT id, name, ip, endpoint, currentdate AS "currentDate" FROM users`);
            return rows;
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { rows } = yield (0, pool_1.query)(`SELECT id, name, ip, endpoint, currentdate AS "currentDate" FROM users WHERE id = $1`, [id]);
            return rows[0] ? rows[0] : null;
        });
    }
    getUserByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const { rows } = yield (0, pool_1.query)(`SELECT id, name, ip, endpoint, currentdate AS "currentDate" FROM users WHERE name = $1`, [name]);
            return rows[0] ? rows[0] : null;
        });
    }
    getUserByIp(ip) {
        return __awaiter(this, void 0, void 0, function* () {
            const { rows } = yield (0, pool_1.query)(`SELECT id, name, ip, endpoint, currentdate AS "currentDate" FROM users WHERE ip = $1`, [ip]);
            return rows[0] ? rows[0] : null;
        });
    }
    getUsersByPartialName(partialName) {
        return __awaiter(this, void 0, void 0, function* () {
            const { rows } = yield (0, pool_1.query)(`SELECT id, name, ip, endpoint, currentdate AS "currentDate" FROM users WHERE name ILIKE $1`, [`%${partialName}%`]);
            return rows;
        });
    }
    getUserByContract(contract) {
        return __awaiter(this, void 0, void 0, function* () {
            const { rows } = yield (0, pool_1.query)(`SELECT id, name, ip, endpoint, currentdate AS "currentDate" FROM users WHERE contract = $1`, [contract]);
            return rows[0] ? rows[0] : null;
        });
    }
    createUser(attributes) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, ip } = attributes;
            const endpoint = `${env_1.config.host}/${env_1.config.typeEndPoint}`;
            const currentDate = new Date();
            const { rows } = yield (0, pool_1.query)(`INSERT INTO users (name, ip, endpoint, currentdate) VALUES ($1, $2, $3, $4) RETURNING id;`, [name, ip, endpoint, currentDate]);
            const id = rows[0].id;
            return {
                id,
                name,
                ip,
                endpoint,
                currentDate,
            };
        });
    }
}
exports.UserApiModel = UserApiModel;
