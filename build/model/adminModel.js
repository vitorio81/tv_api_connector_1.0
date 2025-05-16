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
exports.adminModel = void 0;
const pool_1 = require("../config/pool");
class adminModel {
    constructor(attributes) {
        this.id = attributes.id;
        this.username = attributes.username;
        this.email = attributes.email;
        this.password = attributes.password;
        this.currentDate = attributes.currentDate;
    }
    getAllAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            const { rows } = yield (0, pool_1.query)(`
      SELECT 
      id, username, email, password, currentdate AS "currentDate"
      FROM admin`);
            return rows;
        });
    }
    getAdminById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { rows } = yield (0, pool_1.query)(`
      SELECT 
      id, username, email, password, currentdate AS "currentDate"
      FROM admin WHERE id =$1`, [id]);
            return rows.length > 0 ? rows[0] : null;
        });
    }
    getAdminByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const { rows } = yield (0, pool_1.query)(`
      SELECT 
      id, username, email, password, currentdate AS "currentDate"
      FROM admin WHERE email =$1`, [email]);
            return rows[0];
        });
    }
    createAdmin(attributes) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, email, password } = attributes;
            const currentDate = new Date();
            const { rows } = yield (0, pool_1.query)(`INSERT INTO admin (username, email, password, currentdate) VALUES ($1, $2, $3, $4)RETURNING id;`, [username, email, password, currentDate]);
            const id = rows[0].id;
            const newAdmin = {
                id,
                username,
                email,
                password,
                currentDate,
            };
            return newAdmin;
        });
    }
}
exports.adminModel = adminModel;
