import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { DataType, newDb } from "pg-mem";
import * as schema from "./schema/index";

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

    // Register gen_random_uuid for pg-mem
    mem.public.registerFunction({
        name: 'gen_random_uuid',
        args: [],
        returns: DataType.uuid,
        implementation: () => {
             // Simple UUID mock
             return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
    });

    try {
      mem.public.none(`
        -- Enums
        CREATE TYPE "user_type" AS ENUM('owner', 'tenant');
        CREATE TYPE "invoice_status" AS ENUM('pending', 'paid', 'overdue', 'cancelled');
        CREATE TYPE "payment_method" AS ENUM('credit_card', 'bank_transfer', 'cash');
        CREATE TYPE "ticket_category" AS ENUM('plumbing', 'electrical', 'elevator', 'cleaning', 'other');
        CREATE TYPE "ticket_status" AS ENUM('open', 'approved', 'in_progress', 'resolved', 'cancelled');
        CREATE TYPE "ticket_urgency" AS ENUM('low', 'medium', 'critical');
        CREATE TYPE "expense_category" AS ENUM('maintenance', 'repair', 'cleaning', 'electricity', 'water', 'personnel', 'other');
        CREATE TYPE "notification_type" AS ENUM('info', 'success', 'warning', 'error');

        -- Tables
        CREATE TABLE IF NOT EXISTS "apartments" (
            "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            "name" text NOT NULL,
            "address" text NOT NULL,
            "subscription_type" text DEFAULT 'standard' NOT NULL
        );

        CREATE TABLE IF NOT EXISTS "users" (
            "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            "email" text NOT NULL UNIQUE,
            "phone_number" text UNIQUE,
            "full_name" text NOT NULL,
            "password" text NOT NULL,
            "avatar_url" text,
            "role" text DEFAULT 'resident' NOT NULL,
            "created_at" timestamp DEFAULT now() NOT NULL,
            "updated_at" timestamp DEFAULT now() NOT NULL,
            "deleted_at" timestamp
        );

        CREATE TABLE IF NOT EXISTS "units" (
            "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            "apartment_id" uuid NOT NULL REFERENCES "apartments"("id"),
            "block_name" text,
            "unit_number" text NOT NULL
        );

        CREATE TABLE IF NOT EXISTS "unit_assignments" (
            "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            "user_id" uuid NOT NULL REFERENCES "users"("id"),
            "unit_id" uuid NOT NULL REFERENCES "units"("id"),
            "user_type" "user_type" NOT NULL
        );

        CREATE TABLE IF NOT EXISTS "announcements" (
            "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            "apartment_id" uuid NOT NULL REFERENCES "apartments"("id"),
            "author_id" uuid NOT NULL REFERENCES "users"("id"),
            "title" text NOT NULL,
            "content" text NOT NULL,
            "created_at" timestamp DEFAULT now() NOT NULL
        );

        CREATE TABLE IF NOT EXISTS "notifications" (
            "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            "user_id" uuid NOT NULL REFERENCES "users"("id"),
            "title" text NOT NULL,
            "message" text NOT NULL,
            "type" "notification_type" DEFAULT 'info' NOT NULL,
            "link" text,
            "is_read" boolean DEFAULT false NOT NULL,
            "created_at" timestamp DEFAULT now() NOT NULL
        );

        CREATE TABLE IF NOT EXISTS "maintenance_tickets" (
            "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            "requester_id" uuid NOT NULL REFERENCES "users"("id"),
            "assigned_to_id" uuid REFERENCES "users"("id"),
            "category" "ticket_category" NOT NULL,
            "title" text NOT NULL,
            "description" text NOT NULL,
            "status" "ticket_status" DEFAULT 'open' NOT NULL,
            "urgency" "ticket_urgency" DEFAULT 'medium' NOT NULL,
            "photo_url" text,
            "created_at" timestamp DEFAULT now() NOT NULL,
            "updated_at" timestamp DEFAULT now() NOT NULL
        );

        CREATE TABLE IF NOT EXISTS "vehicles" (
            "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            "user_id" uuid NOT NULL REFERENCES "users"("id"),
            "plate_number" text NOT NULL,
            "model" text NOT NULL,
            "verified" boolean DEFAULT false NOT NULL,
            "created_at" timestamp DEFAULT now() NOT NULL
        );

        CREATE TABLE IF NOT EXISTS "pets" (
            "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            "user_id" uuid NOT NULL REFERENCES "users"("id"),
            "type" text NOT NULL,
            "name" text NOT NULL,
            "description" text,
            "created_at" timestamp DEFAULT now() NOT NULL
        );

        CREATE TABLE IF NOT EXISTS "emergency_contacts" (
            "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            "user_id" uuid NOT NULL REFERENCES "users"("id"),
            "name" text NOT NULL,
            "phone_number" text NOT NULL,
            "relation" text NOT NULL,
            "created_at" timestamp DEFAULT now() NOT NULL
        );
      `);
    } catch (e) {
      console.error("PG-MEM Init Failed:", e);
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
