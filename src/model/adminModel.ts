import { query } from "../config/pool";
import dotenv from "dotenv";
dotenv.config({ path: "/srv/tv_api_connector_1.0/.env" });

interface adminModelPayloadAttributes {
  id: number;
  username: string;
  email: string;
  password: string;
  currentDate: Date;
}
export class adminModel {
  id: number;
  username: string;
  email: string;
  password: string;
  currentDate: Date;

  constructor(attributes: adminModelPayloadAttributes) {
    this.id = attributes.id;
    this.username = attributes.username;
    this.email = attributes.email;
    this.password = attributes.password;
    this.currentDate = attributes.currentDate;
  }

  async getAllAdmin(): Promise<adminModelPayloadAttributes[]> {
    const { rows } = await query(`
      SELECT 
      id, username, email, password, currentdate AS "currentDate"
      FROM admin`);
    return rows;
  }

  async getAdminById(id: number): Promise<adminModelPayloadAttributes | null> {
    const { rows } = await query(
      `
      SELECT 
      id, username, email, password, currentdate AS "currentDate"
      FROM admin WHERE id =$1`,
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async getAdminByEmail(
    email: string
  ): Promise<adminModelPayloadAttributes | null> {
    const { rows } = await query(
      `
      SELECT 
      id, username, email, password, currentdate AS "currentDate"
      FROM admin WHERE email =$1`,
      [email]
    );
    return rows[0];
  }

  async createAdmin(
    attributes: Omit<adminModelPayloadAttributes, "id" | "currentDate">
  ): Promise<adminModelPayloadAttributes> {
    const { username, email, password } = attributes;
    const currentDate = new Date();
    const { rows } = await query(
      `INSERT INTO admin (username, email, password, currentdate) VALUES ($1, $2, $3, $4)RETURNING id;`,
      [username, email, password, currentDate]
    );
    const id = rows[0].id;
    const newAdmin = {
      id,
      username,
      email,
      password,
      currentDate,
    };
    return newAdmin;
  }
}
