const { query } = require("../../config_database/pool");

require("dotenv").config();

module.exports = {
  getAllIntegrations: async () => {
    const { rows } = await query(`
      SELECT 
      id, name, host, secret, type, currentDate
      FROM integrations`);
    return rows;
  },

  getIntegrationById: async (id) => {
    const { rows } = await query(
      `
      SELECT 
      id, name, host, secret, type, currentDate
      FROM integrations WHERE id = $1`,
      [id]
    );
    return rows[0];
  },

  getIntegrationByName: async (name) => {
    const { rows } = await query(
      `
      SELECT 
      id, name, host, secret, type, currentDate
      FROM integrations WHERE name = $1`,
      [name]
    );
    return rows[0];
  },

  getUsersByPartialName: async (partialName) => {
    const { rows } = await query(
      `SELECT 
      id, name, contract, secret, currentdate AS "currentDate"
     FROM integrations
     WHERE name ILIKE $1`,
      [`%${partialName}%`]
    );
    return rows; // Retorna todos os usuários que contenham 'partialName' no nome
  },

  getIntegrationBySecret: async (secret) => {
    const { rows } = await query(
      `
      SELECT 
      id, name, host, secret, type, currentDate
      FROM integrations WHERE secret = $1`,
      [secret]
    );
    return rows[0];
  },

  createIntegration: async (name, host, secret, type) => {
    const currentDate = new Date().toISOString().split("T")[0];
    const newIntegration = {
      name,
      host,
      secret,
      type,
      currentDate,
    };
    await query(
      `INSERT INTO integrations (name, host, secret, type, currentdate) VALUES ($1, $2, $3, $4, $5);`,
      [name, host, secret, type, currentDate]
    );
    return newIntegration;
  },
};
