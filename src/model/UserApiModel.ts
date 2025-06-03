import { config } from "../config/env";
import { query } from "../config/pool";

interface UserApiModelPayloadAttributes {
  id: number;
  name: string;
  ip: string;
  endpoint: string;
  currentDate: Date;
}

export class UserApiModel {
  id: number;
  name: string;
  ip: string;
  endpoint: string;
  currentDate: Date;

  constructor(attributes: UserApiModelPayloadAttributes) {
    this.id = attributes.id;
    this.name = attributes.name;
    this.ip = attributes.ip;
    this.endpoint = attributes.endpoint;
    this.currentDate = attributes.currentDate;
  }

  async getAllUsers(): Promise<UserApiModelPayloadAttributes[]> {
    const { rows } = await query(
      `SELECT id, name, ip, endpoint, currentdate AS "currentDate" FROM users`
    );
    return rows as UserApiModelPayloadAttributes[];
  }

  async getUserById(id: number): Promise<UserApiModelPayloadAttributes | null> {
    const { rows } = await query(
      `SELECT id, name, ip, endpoint, currentdate AS "currentDate" FROM users WHERE id = $1`,
      [id]
    );
    return rows[0] ? (rows[0] as UserApiModelPayloadAttributes) : null;
  }

  async getUserByName(
    name: string
  ): Promise<UserApiModelPayloadAttributes | null> {
    const { rows } = await query(
      `SELECT id, name, ip, endpoint, currentdate AS "currentDate" FROM users WHERE name = $1`,
      [name]
    );
    return rows[0] ? (rows[0] as UserApiModelPayloadAttributes) : null;
  }

  async getUserByIp(ip: string): Promise<UserApiModelPayloadAttributes | null> {
    const { rows } = await query(
      `SELECT id, name, ip, endpoint, currentdate AS "currentDate" FROM users WHERE ip = $1`,
      [ip]
    );
    return rows[0] ? (rows[0] as UserApiModelPayloadAttributes) : null;
  }

  async getUsersByPartialName(
    partialName: string
  ): Promise<UserApiModelPayloadAttributes[]> {
    const { rows } = await query(
      `SELECT id, name, ip, endpoint, currentdate AS "currentDate" FROM users WHERE name ILIKE $1`,
      [`%${partialName}%`]
    );
    return rows as UserApiModelPayloadAttributes[];
  }

  async getUserByContract(
    contract: string
  ): Promise<UserApiModelPayloadAttributes | null> {
    const { rows } = await query(
      `SELECT id, name, ip, endpoint, currentdate AS "currentDate" FROM users WHERE contract = $1`,
      [contract]
    );
    return rows[0] ? (rows[0] as UserApiModelPayloadAttributes) : null;
  }

  async createUser(
    attributes: Omit<
      UserApiModelPayloadAttributes,
      "id" | "endpoint" | "currentDate"
    >
  ): Promise<UserApiModelPayloadAttributes> {
    const { name, ip } = attributes;
    const endpoint = `${config.host}/${config.typeEndPoint}`;
    const currentDate = new Date();
    const { rows } = await query(
      `INSERT INTO users (name, ip, endpoint, currentdate) VALUES ($1, $2, $3, $4) RETURNING id;`,
      [name, ip, endpoint, currentDate]
    );
    const id = rows[0].id;
    return {
      id,
      name,
      ip,
      endpoint,
      currentDate,
    };
  }
}
