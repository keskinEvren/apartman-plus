import { db } from "@/db";
import { emergencyContacts, pets, vehicles } from "@/db/schema/profiles";
import { users } from "@/db/schema/users";
import { eq, ilike } from "drizzle-orm";
import { z } from "zod";
import { adminProcedure, protectedProcedure, router } from "../trpc";

export const profileRouter = router({
  // --- VEHICLES ---
  getVehicles: protectedProcedure.query(async ({ ctx }) => {
    return await db.select().from(vehicles).where(eq(vehicles.userId, ctx.user.id));
  }),

  addVehicle: protectedProcedure
    .input(z.object({
      plateNumber: z.string().min(1),
      model: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      return await db.insert(vehicles).values({
        userId: ctx.user.id,
        plateNumber: input.plateNumber,
        model: input.model,
      });
    }),

  deleteVehicle: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Ensure user owns the vehicle
      return await db.delete(vehicles).where(eq(vehicles.id, input.id) && eq(vehicles.userId, ctx.user.id));
    }),

  // --- PETS ---
  getPets: protectedProcedure.query(async ({ ctx }) => {
    return await db.select().from(pets).where(eq(pets.userId, ctx.user.id));
  }),

  addPet: protectedProcedure
    .input(z.object({
      type: z.enum(["DOG", "CAT", "BIRD", "OTHER"]),
      name: z.string().min(1),
      description: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return await db.insert(pets).values({
        userId: ctx.user.id,
        type: input.type,
        name: input.name,
        description: input.description,
      });
    }),

  deletePet: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await db.delete(pets).where(eq(pets.id, input.id) && eq(pets.userId, ctx.user.id));
    }),

  // --- EMERGENCY CONTACTS ---
  getContacts: protectedProcedure.query(async ({ ctx }) => {
    return await db.select().from(emergencyContacts).where(eq(emergencyContacts.userId, ctx.user.id));
  }),

  addContact: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      phoneNumber: z.string().min(10),
      relation: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      return await db.insert(emergencyContacts).values({
        userId: ctx.user.id,
        name: input.name,
        phoneNumber: input.phoneNumber,
        relation: input.relation,
      });
    }),

  deleteContact: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await db.delete(emergencyContacts).where(eq(emergencyContacts.id, input.id) && eq(emergencyContacts.userId, ctx.user.id));
    }),

  // --- ADMIN PROCEDURES ---
  adminGetHousehold: adminProcedure
    .input(z.object({ userId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      // Role check handled by adminProcedure middleware

      const userVehicles = await db.select().from(vehicles).where(eq(vehicles.userId, input.userId));
      const userPets = await db.select().from(pets).where(eq(pets.userId, input.userId));
      const userContacts = await db.select().from(emergencyContacts).where(eq(emergencyContacts.userId, input.userId));

      return {
        vehicles: userVehicles,
        pets: userPets,
        contacts: userContacts
      };
    }),

  // --- RESIDENT PROCEDURES ---
  searchPlate: protectedProcedure
    .input(z.object({ plateNumber: z.string().min(3) }))
    .mutation(async ({ ctx, input }) => {
       // Search for vehicle and join with user info
       // Since we are using Drizzle, we can do a simple query or join
       // For simplicity, let's fetch vehicle then fetch user. 
       // Note: Efficient way is to join but Drizzle syntax depends on relations definition.
       // Let's assume manual join for now or direct select if relations aren't setup.
       
       const foundVehicles = await db
        .select({
            vehicle: vehicles,
            owner: {
                fullName: users.fullName,
                phoneNumber: users.phoneNumber,
                email: users.email
            }
        })
        .from(vehicles)
        .innerJoin(users, eq(vehicles.userId, users.id))
        .where(ilike(vehicles.plateNumber, `%${input.plateNumber}%`))
        .limit(10);

       return foundVehicles;
    }),

  // --- ADMIN ACTIONS ---
  toggleVehicleVerification: adminProcedure
    .input(z.object({
      id: z.string().uuid(),
      verified: z.boolean()
    }))
    .mutation(async ({ ctx, input }) => {
      await db
        .update(vehicles)
        .set({ verified: input.verified })
        .where(eq(vehicles.id, input.id));
      
      return { success: true };
    }),
});
