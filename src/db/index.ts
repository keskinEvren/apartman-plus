import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { newDb } from "pg-mem";
import * as schema from "./schema";

export type DbClient = NodePgDatabase<typeof schema>;

// Persist DB connection in development
declare global {
  var db: DbClient | undefined;
}

const getDb = (): DbClient => {
  console.log("🔌 DB Init: NODE_ENV=", process.env.NODE_ENV);
  console.log("🔌 DB Init: DB_INTERNAL=", process.env.DB_INTERNAL);
  console.log("🔌 DB Init: DATABASE_URL=", process.env.DATABASE_URL);

  // Use in-memory DB if NODE_ENV is test or if specifically requested via DB_INTERNAL
  if (false && (process.env.NODE_ENV === "test" || process.env.DB_INTERNAL === "true")) {
    if (global.db) return global.db;

    const mem = newDb();
    
    // Auto-create tables for in-memory mode
    try {
      mem.public.none(`
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY,
          email TEXT NOT NULL UNIQUE,
          phone_number TEXT UNIQUE,
          full_name TEXT NOT NULL,
          password TEXT NOT NULL,
          avatar_url TEXT,
          role TEXT DEFAULT 'resident' NOT NULL,
          created_at TIMESTAMP DEFAULT NOW() NOT NULL,
          updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
          deleted_at TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS apartments (
          id UUID PRIMARY KEY,
          name TEXT NOT NULL,
          address TEXT NOT NULL,
          subscription_type TEXT DEFAULT 'standard' NOT NULL
        );
        -- Add other mocks if needed for tests
      `);
      /*
        -- Insert a dummy user for the demo
        INSERT INTO users (id, email, full_name, password, role) 
        VALUES ('00000000-0000-0000-0000-000000000001', 'admin@example.com', 'Admin User', 'hashed_password', 'admin');
      */
    } catch (e) {
      process.stderr.write(`DB Init Warning: ${e}\n`);
    }
    
    const { Pool: MemPool } = mem.adapters.createPg();
    const instance = drizzle(new MemPool() as any, { schema });
    global.db = instance;
    return instance;
  }
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  return drizzle(pool, { schema }) as any;
};

export const db = getDb();
