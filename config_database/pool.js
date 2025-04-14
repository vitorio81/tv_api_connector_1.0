const { Pool } = require("pg")

const pool = new Pool({
    connectionString: "postgresql://postgres:123456@localhost:5432/banco_tv_conector"
});

async function query(queryString, params, callback) {
    console.log("log: query executada - " + queryString)
    return pool.query(queryString, params, callback);
}

module.exports = {query};