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
exports.userApiModel = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "/srv/tv_api_connector/.env" });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const pool_1 = require("../config_database/pool");
const API_SECRET_TOKEN_KEY = process.env.API_SECRET_TOKEN_KEY || "default_secret_key";
const TYPE_LOGIN_USER = process.env.TYPE_LOGIN_USER || "default_secret_key";
const PORT = process.env.PORT || "default_secret_key";
const HOST = process.env.HOST || "default_secret_key";
class userApiModel {
    constructor(attributes) {
        this.id = attributes.id;
        this.name = attributes.name;
        this.secret = attributes.secret;
        this.endpoint = attributes.endpoint;
        this.currentDate = attributes.currentDate;
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const { rows } = yield (0, pool_1.query)(`SELECT
        id, name, secret, endpoint, currentdate AS "currentDate"
      FROM users
    `);
            return rows; // Retorna todos os usuários
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { rows } = yield (0, pool_1.query)(`SELECT 
      id, name, secret, endpoint, currentdate AS "currentDate"
    FROM users WHERE id = $1
    `, [id]);
            return rows[0];
        });
    }
    getUserByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const { rows } = yield (0, pool_1.query)(` SELECT 
      id, name, secret, endpoint, currentdate AS "currentDate"
      FROM users WHERE name = $1`, [name]);
            return rows[0];
        });
    }
    getUsersByPartialName(partialName) {
        return __awaiter(this, void 0, void 0, function* () {
            const { rows } = yield (0, pool_1.query)(`SELECT 
      id, name, secret, endpoint, currentdate AS "currentDate"
     FROM users
     WHERE name ILIKE $1`, [`%${partialName}%`]);
            return rows; // Retorna todos os usuários que contenham 'partialName' no nome
        });
    }
    getUserByContract(contract) {
        return __awaiter(this, void 0, void 0, function* () {
            const { rows } = yield (0, pool_1.query)(` SELECT 
      id, name, secret, endpoint, currentdate AS "currentDate"
      FROM users WHERE contract = $1`, [contract]);
            return rows[0];
        });
    }
    getUserBySecret(secret) {
        return __awaiter(this, void 0, void 0, function* () {
            const { rows } = yield (0, pool_1.query)(` SELECT 
      id, name, secret, endpoint, currentdate AS "currentDate"
      FROM users WHERE secret = $1`, [secret]);
            return rows[0];
        });
    }
    createUser(attributes) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name } = attributes;
            if (!API_SECRET_TOKEN_KEY) {
                throw new Error("API_SECRET_TOKEN_KEY is not defined");
            }
            const secret = jsonwebtoken_1.default.sign({ name }, API_SECRET_TOKEN_KEY);
            const endpoint = `${HOST}:${PORT}${TYPE_LOGIN_USER}`;
            const currentDate = new Date();
            const { rows } = yield (0, pool_1.query)(`INSERT INTO users (name, secret, endpoint, currentdate) VALUES ($1, $2, $3, $4) RETURNING id;`, [name, secret, endpoint, currentDate]);
            const id = rows[0].id;
            const newUser = {
                id,
                name,
                secret,
                endpoint,
                currentDate,
            };
            return newUser;
        });
    }
}
exports.userApiModel = userApiModel;
