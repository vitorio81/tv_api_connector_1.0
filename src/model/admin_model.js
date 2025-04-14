const { query } = require("../../config_database/pool");

require("dotenv").config();

module.exports = {
  getAllAdmin: async () => {
    const { rows } = await query(`
      SELECT 
      id, username, email, password, currentDate
      FROM admin`);
    return rows;
  },

  getAdminById: async (id) => {
    const { rows } = await query(
      `
      SELECT 
      id, username, email, password, currentDate
      FROM admin WHERE id =$1`,
      [id]
    );
    return rows[0];
  },

  getAdminByEmail: async (email) => {
    const { rows } = await query(
      `
      SELECT 
      id, username, email, password, currentDate
      FROM admin WHERE email =$1`,
      [email]
    );
    return rows[0];
  },

  createAdmin: async (username, email, password) => {
    const currentDate = new Date().toISOString().split("T")[0];
    const newAdmin = {
      id,
      username,
      email,
      password,
      currentDate,
    };
    await query(
      `INSET INTO admin (id, username, email, password, currentdate,) VALUES ($1, $2, $3, $4, $5);`,
      [id, username, email, password, currentDate]
    );
    return newAdmin;
  },
};
