import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

const connectionString =
    process.env.DATABASE_URL || "postgres://user:password@localhost:5432/elysia_clean_db";

const client = new Client({
    connectionString,
});

await client.connect();

export const pgDb = drizzle(client);

export { client as pgClient };
