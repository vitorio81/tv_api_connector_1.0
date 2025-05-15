import { query } from "../config/pool";

interface requestModelPayloadAttributes {
  id: number;
  host: string;
  status: string;
  validate: boolean;
  dateTimerequest: Date;
}

export class requestModel {
  id: number;
  host: string;
  status: string;
  validate: boolean;
  dateTimerequest: Date;

  constructor(attributes: requestModelPayloadAttributes) {
    this.id = attributes.id;
    this.host = attributes.host;
    this.status = attributes.status;
    this.validate = attributes.validate;
    this.dateTimerequest = attributes.dateTimerequest;
  }

  async getAllRequests(): Promise<requestModelPayloadAttributes[]> {
    const { rows } = await query(`
      SELECT 
      id, host, status, validate, datetimerequest AS "dateTimerequest"
      FROM requests`);
    return rows;
  }

  async getRequestById(
    id: number
  ): Promise<requestModelPayloadAttributes | null> {
    const { rows } = await query(
      `
      SELECT 
      id, host, status, validate, datetimerequest AS "dateTimerequest"
      FROM requests WHERE id = $1`,
      [id]
    );
    return rows[0];
  }

  async getRequestByHosts(partialHosts: string) {
    const { rows } = await query(
      `
      SELECT 
      id, host, status, validate, datetimerequest AS "dateTimerequest"
      FROM requests WHERE host ILIKE $1`,
      [`%${partialHosts}%`]
    );
    return rows;
  }

  async getRequestByStatus(partialSattus: string) {
    const { rows } = await query(
      `SELECT 
     id, host, status, validate, datetimerequest AS "dateTimerequest"
     FROM requests
     WHERE name ILIKE $1`,
      [`%${partialSattus}%`]
    );
    return rows; // Retorna todos os usuários que contenham 'partialName' no nome
  }

  async createRequest(
    attributes: Omit<requestModelPayloadAttributes, "id">
  ): Promise<requestModelPayloadAttributes> {
    const { host, status, validate } = attributes;
    const dateTimerequest = new Date();
    const { rows } = await query(
      `INSERT INTO requests (host, status, validate, datetimerequest) VALUES ($1, $2, $3, $4)RETURNING id;`,
      [host, status, validate, dateTimerequest]
    );
    const id = rows[0].id;
    const newRequest = {
      id,
      host,
      status,
      validate,
      dateTimerequest,
    };
    return newRequest;
  }
}
