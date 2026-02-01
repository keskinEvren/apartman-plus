
import "dotenv/config";
import { db } from "../src/db";
import { reservations } from "../src/db/schema/facilities";

async function main() {
  console.log("Wiping all reservations...");
  await db.delete(reservations);
  console.log("Reservations deleted.");
}

main().catch(console.error);
