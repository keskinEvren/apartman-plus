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
  // In production or when DB_INTERNAL is explicitly false, use real Postgres
  // For tests, we might want to use pg-mem if configured
  if (process.env.NODE_ENV === "test" && process.env.DB_INTERNAL === "true") {
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
        -- Add other mocks if needed for tests
      `);
    } catch (e) {
      // warning suppressed
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
