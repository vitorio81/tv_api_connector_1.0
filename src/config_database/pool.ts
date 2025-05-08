import { Pool } from "pg";

const pool = new Pool({
    connectionString: "postgresql://postgres:123456@localhost:5432/banco_tv_conector"
});

interface QueryParams {
    queryString: string;
    params?: any[];
}

export async function query(queryString: QueryParams['queryString'], params: QueryParams['params'] = []): Promise<any> {
    console.log("log: query executada - " + queryString);
    return pool.query(queryString, params);
}   

