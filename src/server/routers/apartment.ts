import { eq } from "drizzle-orm";
import { z } from "zod";
import { apartments, unitAssignments, units } from "../../db/schema/apartments";
import { adminProcedure, protectedProcedure, router } from "../trpc";

export const apartmentRouter = router({
  // --- Apartments ---

  list: adminProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(apartments);
  }),

  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        address: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [newApartment] = await ctx.db
        .insert(apartments)
        .values({
          name: input.name,
          address: input.address,
        })
        .returning();
      return newApartment;
    }),

  // --- Units ---

  getUnits: protectedProcedure
    .input(z.object({ apartmentId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(units)
        .where(eq(units.apartmentId, input.apartmentId))
        .orderBy(units.unitNumber); // Simple ordering
    }),

  createUnit: adminProcedure
    .input(
      z.object({
        apartmentId: z.string().uuid(),
        unitNumber: z.string().min(1),
        blockName: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [newUnit] = await ctx.db
        .insert(units)
        .values({
          apartmentId: input.apartmentId,
          unitNumber: input.unitNumber,
          blockName: input.blockName,
        })
        .returning();
      return newUnit;
    }),

  // --- Assignments ---

  assignUser: adminProcedure
    .input(
      z.object({
        unitId: z.string().uuid(),
        userId: z.string().uuid(),
        userType: z.enum(["owner", "tenant"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [assignment] = await ctx.db
        .insert(unitAssignments)
        .values({
          unitId: input.unitId,
          userId: input.userId,
          userType: input.userType,
        })
        .returning();
      return assignment;
    }),
});
