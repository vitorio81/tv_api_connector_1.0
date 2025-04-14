const { query } = require("../../config_database/pool");
require("dotenv").config();


module.exports = {
  getAllRequests: async () => {
    const { rows } = await query(`
      SELECT 
      id, host, status, validate, dateTimerequest
      FROM requests`);
    return rows;
  },

  getRequestById: async (id) => {
    const { rows } = await query(
      `
      SELECT 
      id, host, status, validate, dateTimerequest
      FROM requests WHERE id = $1`,
      [id]
    );
    return rows[0];
  },

  getRequestByHosts: async (partialHosts) => {
    const { rows } = await query(
      `
      SELECT 
      id, host, status, validate, dateTimerequest
      FROM requests WHERE host ILIKE $1`,
      [`%${partialHosts}%`]
    );
    return rows;
  },

  getRequestByStatus: async (partialSattus) => {
    const { rows } = await query(
      `SELECT 
     id, host, status, validate, dateTimerequest
     FROM requests
     WHERE name ILIKE $1`,
      [`%${partialSattus}%`]
    );
    return rows; // Retorna todos os usuários que contenham 'partialName' no nome
  },

  createRequest: async ({ host, status, validate }) => {
    const dataTimeRequest = new Date
    const newRequest = {
      host,
      status,
      validate,
      dataTimeRequest
    };
    await query(`INSERT INTO requests (host, status, validate, datetimerequest) VALUES ($1, $2, $3, $4);`, [host, status, validate, dataTimeRequest]
    );
    return newRequest;
  },
};
