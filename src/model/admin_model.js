const { query } = require("../config_database/pool");

require("dotenv").config();

module.exports = {
  getAllAdmin: async () => {
    const { rows } = await query(`
      SELECT 
      id, username, email, password, currentdate AS "currentDate"
      FROM admin`);
    return rows;
  },

  getAdminById: async (id) => {
    const { rows } = await query(
      `
      SELECT 
      id, username, email, password, currentdate AS "currentDate"
      FROM admin WHERE id =$1`,
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  },

  getAdminByEmail: async (email) => {
    const { rows } = await query(
      `
      SELECT 
      id, username, email, password, currentdate AS "currentDate"
      FROM admin WHERE email =$1`,
      [email]
    );
    return rows[0];
  },

  createAdmin: async (username, email, password) => {
    const currentDate = new Date().toISOString().split("T")[0];
    const newAdmin = {
      username,
      email,
      password,
      currentDate
    };
    await query(
      `INSERT INTO admin (username, email, password, currentdate) VALUES ($1, $2, $3, $4);`,
      [username, email, password, currentDate]
    );
    return newAdmin;
  },
};
