import { Pool } from "pg";

const pool = new Pool({
  connectionString: "postgresql://db:db@localhost:5432/db",
});

interface QueryParams {
    queryString: string;
    params?: any[];
}

export async function query(queryString: QueryParams['queryString'], params: QueryParams['params'] = []): Promise<any> {
    console.log("log: query executada - " + queryString);
    return pool.query(queryString, params);
}   

