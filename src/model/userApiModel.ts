import dotenv from "dotenv";
dotenv.config({ path: "/srv/tv_api_connector/.env" });
import jwt from "jsonwebtoken";
import { query } from "../config_database/pool";

const API_SECRET_TOKEN_KEY =
  process.env.API_SECRET_TOKEN_KEY || "default_secret_key";

const TYPE_LOGIN_USER = process.env.TYPE_LOGIN_USER || "default_secret_key";
const PORT = process.env.PORT || "default_secret_key";
const HOST = process.env.HOST || "default_secret_key";

interface userApiModelPayloadAttributes {
  id: number;
  name: string;
  secret: string;
  endpoint: string;
  currentDate: Date;
}

export class userApiModel {
  id: number;
  name: string;
  secret: string;
  endpoint: string;
  currentDate: Date;

  constructor(attributes: userApiModelPayloadAttributes) {
    this.id = attributes.id;
    this.name = attributes.name;
    this.secret = attributes.secret;
    this.endpoint = attributes.endpoint;
    this.currentDate = attributes.currentDate;
  }
  async getAllUsers(): Promise<userApiModelPayloadAttributes[]> {
    const { rows } = await query(
      `SELECT
        id, name, secret, endpoint, currentdate AS "currentDate"
      FROM users
    `
    );
    return rows as userApiModelPayloadAttributes[]; // Retorna todos os usuários
  }

  async getUserById(id: number): Promise<userApiModelPayloadAttributes | null> {
    const { rows } = await query(
      `SELECT 
      id, name, secret, endpoint, currentdate AS "currentDate"
    FROM users WHERE id = $1
    `,
      [id]
    );
    return rows[0] as userApiModelPayloadAttributes;
  }

  async getUserByName(
    name: string
  ): Promise<userApiModelPayloadAttributes | null> {
    const { rows } = await query(
      ` SELECT 
      id, name, secret, endpoint, currentdate AS "currentDate"
      FROM users WHERE name = $1`,
      [name]
    );
    return rows[0] as userApiModelPayloadAttributes;
  }

  async getUsersByPartialName(partialName: string) {
    const { rows } = await query(
      `SELECT 
      id, name, secret, endpoint, currentdate AS "currentDate"
     FROM users
     WHERE name ILIKE $1`,
      [`%${partialName}%`]
    );
    return rows as userApiModelPayloadAttributes[]; // Retorna todos os usuários que contenham 'partialName' no nome
  }

  async getUserByContract(
    contract: string
  ): Promise<userApiModelPayloadAttributes | null> {
    const { rows } = await query(
      ` SELECT 
      id, name, secret, endpoint, currentdate AS "currentDate"
      FROM users WHERE contract = $1`,
      [contract]
    );
    return rows[0] as userApiModelPayloadAttributes;
  }

  async getUserBySecret(
    secret: string
  ): Promise<userApiModelPayloadAttributes | null> {
    const { rows } = await query(
      ` SELECT 
      id, name, secret, endpoint, currentdate AS "currentDate"
      FROM users WHERE secret = $1`,
      [secret]
    );
    return rows[0];
  }
  async createUser(
    attributes: Omit<
      userApiModelPayloadAttributes,
      "id" | "secret" | "endpoint" | "currentDate"
    >
  ): Promise<userApiModelPayloadAttributes> {
    const { name } = attributes;
    if (!API_SECRET_TOKEN_KEY) {
      throw new Error("API_SECRET_TOKEN_KEY is not defined");
    }
    const secret = jwt.sign({ name }, API_SECRET_TOKEN_KEY);
    const endpoint = `${HOST}:${PORT}${TYPE_LOGIN_USER}`;
    const currentDate = new Date();
    const { rows } = await query(
      `INSERT INTO users (name, secret, endpoint, currentdate) VALUES ($1, $2, $3, $4) RETURNING id;`,
      [name, secret, endpoint, currentDate]
    );
    const id = rows[0].id;
    const newUser = {
      id,
      name,
      secret,
      endpoint,
      currentDate,
    };
    return newUser;
  }
}
