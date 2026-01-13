#!/usr/bin/env tsx
/**
 * Create Admin User Script
 *
 * Creates an admin user for initial access.
 * Run with: npm run create-admin
 */

// import { db } from "@/db";
// import { users } from "@/db/schema";
// import bcrypt from "bcryptjs";

async function createAdmin() {
  console.log("👤 Creating admin user...");

  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const password = process.env.ADMIN_PASSWORD || "admin123";

  try {
    // Uncomment when auth module is configured:
    // const hashedPassword = await bcrypt.hash(password, 12);
    // const [admin] = await db.insert(users).values({
    //   email,
    //   password: hashedPassword,
    //   name: "Admin",
    //   role: "admin",
    // }).returning();

    console.log("✅ Admin user created!");
    console.log("");
    console.log("📝 Credentials:");
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log("");
    console.log("⚠️  Change this password immediately after first login!");

  } catch (error) {
    console.error("❌ Failed to create admin:", error);
    process.exit(1);
  }

  process.exit(0);
}

createAdmin();
