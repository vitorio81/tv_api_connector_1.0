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
const pool_1 = require("./pool");
function createTable() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, pool_1.query)(`
    CREATE TABLE IF NOT EXISTS admin (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL,
      password VARCHAR(100) NOT NULL,
      currentdate DATE NOT NULL
    );
  `);
        yield (0, pool_1.query)(`
    CREATE TABLE IF NOT EXISTS integrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      host VARCHAR(100) NOT NULL,
      secret VARCHAR(100) NOT NULL,
      idtoken INT NOT NULL,
      currentdate DATE NOT NULL
    );
  `);
        yield (0, pool_1.query)(`
    CREATE TABLE IF NOT EXISTS requests (
      id SERIAL PRIMARY KEY,
      host VARCHAR(100) NOT NULL,
      status VARCHAR(50) NOT NULL,
      validate VARCHAR(10) NOT NULL,
      datetimerequest TIMESTAMP NOT NULL
    );
  `);
        yield (0, pool_1.query)(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      ip VARCHAR(45) NOT NULL,
      endpoint VARCHAR(150) NOT NULL,
      currentdate DATE NOT NULL
    );
  `);
        console.log("Tabelas criadas com sucesso!");
        process.exit(0);
    });
}
createTable();
