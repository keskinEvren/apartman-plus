
import { db } from "@/db";
import { users } from "@/db/schema/users";
import { appRouter } from "@/server";
import { createContext } from "@/server/trpc";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

// Mock user for testing (Resident)
const TEST_RESIDENT = {
  email: "test_resident@example.com",
  fullName: "Test Resident User",
  role: "resident" as const,
  password: "hashed_password_placeholder"
};

// Mock admin for testing
const TEST_ADMIN = {
  email: "test_admin@example.com",
  fullName: "Test Admin User",
  role: "admin" as const,
  password: "hashed_password_placeholder"
};

console.log("DEBUG: DATABASE_URL used in test:", process.env.DATABASE_URL);

describe("Profile Router Integration Test", () => {
  let residentCtx: any;
  let residentCaller: any;
  let adminCtx: any;
  let adminCaller: any;
  
  let residentId: string;
  let adminId: string;

  beforeAll(async () => {
    // 1. Create users
    const [resident] = await db.insert(users).values(TEST_RESIDENT).returning();
    residentId = resident.id;

    const [admin] = await db.insert(users).values(TEST_ADMIN).returning();
    adminId = admin.id;

    // 2. Create Resident Context & Caller
    const residentToken = jwt.sign({ userId: resident.id }, process.env.JWT_SECRET || "default_secret");
    residentCtx = await createContext({
      headers: new Headers({ authorization: `Bearer ${residentToken}` })
    });
    residentCaller = appRouter.createCaller(residentCtx);

    // 3. Create Admin Context & Caller
    const adminToken = jwt.sign({ userId: admin.id }, process.env.JWT_SECRET || "default_secret");
    adminCtx = await createContext({
      headers: new Headers({ authorization: `Bearer ${adminToken}` })
    });
    adminCaller = appRouter.createCaller(adminCtx);
  });

  afterAll(async () => {
    // Cleanup
    if (residentId) await db.delete(users).where(eq(users.id, residentId));
    if (adminId) await db.delete(users).where(eq(users.id, adminId));
  });

  // --- VEHICLES ---
  test("should add and list vehicles (Resident)", async () => {
    const plate = "34 TEST 99";
    await residentCaller.profile.addVehicle({
      plateNumber: plate,
      model: "Red Tesla Model 3"
    });

    const vehicles = await residentCaller.profile.getVehicles();
    expect(vehicles).toHaveLength(1);
    expect(vehicles[0].plateNumber).toBe(plate);
  });

  // --- PETS ---
  test("should add and list pets (Resident)", async () => {
    const petName = "Boncuk";
    await residentCaller.profile.addPet({
      name: petName,
      type: "CAT",
      description: "White Persian Cat"
    });

    const pets = await residentCaller.profile.getPets();
    expect(pets).toHaveLength(1);
    expect(pets[0].name).toBe(petName);
  });

  // --- SEARCH PLATE ---
  test("should search vehicle by plate (Resident)", async () => {
    // Provide partial plate search
    const results = await residentCaller.profile.searchPlate({ plateNumber: "TEST 99" });
    
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].vehicle.plateNumber).toBe("34 TEST 99");
    expect(results[0].owner.fullName).toBe(TEST_RESIDENT.fullName);
    
    // Check security: Ensure sensitive data like password/id is NOT strictly exposed 
    // (though in test env we just check fields present)
    expect(results[0].owner.password).toBeUndefined();
  });

  // --- ADMIN HOUSEHOLD VIEW ---
  test("should allow admin to view any household", async () => {
    // Admin fetching resident's data
    const household = await adminCaller.profile.adminGetHousehold({ userId: residentId });
    
    expect(household.vehicles).toHaveLength(1);
    expect(household.pets).toHaveLength(1);
    expect(household.vehicles[0].plateNumber).toBe("34 TEST 99");
  });

  test("should DENY resident from viewing others household directly", async () => {
    // Resident trying to call admin endpoint
    await expect(residentCaller.profile.adminGetHousehold({ userId: adminId }))
        .rejects
        .toThrow("Admin access required"); // or "UNAUTHORIZED" depending on implementation
  });

});
