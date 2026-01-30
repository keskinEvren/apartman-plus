
import { eq } from "drizzle-orm";
import { db } from "../src/db";
import { users } from "../src/db/schema";

async function main() {
    const email = "evrenkeskin1998@gmail.com";
    const user = await db.query.users.findFirst({
        where: eq(users.email, email)
    });
    console.log("User Role Check:", user ? user.role : "User not found");
    process.exit(0);
}
main();
