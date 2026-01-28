import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "../src/db";

async function main() {
  console.log("🔄 Running migrations...");
  try {
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("✅ Migrations completed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

main();
