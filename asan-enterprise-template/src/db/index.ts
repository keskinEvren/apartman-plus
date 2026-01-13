import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// Create pool - will be initialized when DATABASE_URL is available
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create drizzle instance
export const db = drizzle(pool, { schema });

// Export types
export type DbClient = typeof db;
