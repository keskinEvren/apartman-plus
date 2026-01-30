
import { eq } from "drizzle-orm";
import { db } from "../src/db"; // Adjust path if needed
import { users } from "../src/db/schema"; // Adjust path if needed

async function main() {
  console.log("Attempting DB connection...");
  
  try {
    const testEmail = `test_${Date.now()}@example.com`;
    console.log(`Inserting user: ${testEmail}`);

    const [user] = await db.insert(users).values({
      email: testEmail,
      password: "hashed_password_mock",
      fullName: "Test DB Insert",
      role: "resident"
    }).returning();

    console.log("✅ User inserted successfully:", user);

    // Verify retrieval
    const fetched = await db.query.users.findFirst({
        where: eq(users.id, user.id)
    });

    if (fetched) {
        console.log("✅ User retrieved successfully:", fetched.email);
    } else {
        console.error("❌ User inserted but could not be retrieved immediately.");
    }
    
    process.exit(0);
  } catch (error) {
    console.error("❌ DB Insert Failed:", error);
    process.exit(1);
  }
}

main();
