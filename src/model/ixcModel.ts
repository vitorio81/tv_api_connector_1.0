import dotenv from "dotenv";
dotenv.config({ path: "/srv/tv_api_connector_1.0/.env" });
import { query } from "../config/pool";

interface ixcModelPayloadAttributes {
  id: number;
  name: string;
  host: string;
  secret: string;
  idToken: number;
  currentDate: Date;
}

export class ixcModel {
  id: number;
  name: string;
  host: string;
  secret: string;
  idToken: number;
  currentDate: Date;

  constructor(attributes: ixcModelPayloadAttributes) {
    this.id = attributes.id;
    this.name = attributes.name;
    this.host = attributes.host;
    this.secret = attributes.secret;
    this.idToken = attributes.idToken;
    this.currentDate = attributes.currentDate;
  }

  async getAllIntegrations(): Promise<ixcModelPayloadAttributes[]> {
    const { rows } = await query(`
      SELECT 
      id, name, host, secret, idtoken AS "idToken", currentdate AS "currentDate"
      FROM integrations`);
    return rows;
  }

  async getIntegrationById(
    id: number
  ): Promise<ixcModelPayloadAttributes | null> {
    const { rows } = await query(
      `
    SELECT 
    id, name, host, secret, idtoken AS "idToken", currentdate AS "currentDate"
    FROM integrations WHERE id = $1
    `,
      [id]
    );

    return rows.length > 0 ? rows[0] : null;
  }

  async getIntegrationByName(
    name: string
  ): Promise<ixcModelPayloadAttributes | null> {
    const { rows } = await query(
      `
      SELECT 
      id, name, host, secret, idtoken AS "idToken", currentdate AS "currentDate"
      FROM integrations WHERE name = $1`,
      [name]
    );
    return rows[0];
  }

  async getIntegrationBySecre(
    secret: string
  ): Promise<ixcModelPayloadAttributes | null> {
    const { rows } = await query(
      `
      SELECT 
      id, name, host, secret, idtoken AS "idToken", currentdate AS "currentDate"
      FROM integrations WHERE secret = $1`,
      [secret]
    );
    return rows[0];
  }
  async getIntegrationByHost(
    host: string
  ): Promise<ixcModelPayloadAttributes | null> {
    const { rows } = await query(
      `
      SELECT 
      id, name, host, secret, idtoken AS "idToken", currentdate AS "currentDate"
      FROM integrations WHERE secret = $1`,
      [host]
    );
    return rows[0];
  }

  async createIntegration(
    attributes: Omit<ixcModelPayloadAttributes, "id" | "currentDate">
  ): Promise<ixcModelPayloadAttributes> {
    const { name, host, secret, idToken } = attributes;
    const currentDate = new Date();
    const { rows } = await query(
      `INSERT INTO integrations (name, host, secret, idtoken, currentdate) VALUES ($1, $2, $3, $4, $5) RETURNING id;`,
      [name, host, secret, idToken, currentDate]
    );
    const id = rows[0].id;
    const newIntegration = {
      id,
      name,
      host,
      secret,
      idToken,
      currentDate,
    };
    return newIntegration;
  }
}
