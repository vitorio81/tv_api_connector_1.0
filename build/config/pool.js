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
exports.query = query;
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    connectionString: "postgresql://db:db@131.72.68.243:5432/db",
});
function query(queryString_1) {
    return __awaiter(this, arguments, void 0, function* (queryString, params = []) {
        console.log("log: query executada - " + queryString);
        return pool.query(queryString, params);
    });
}
