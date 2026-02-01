import { TRPCError } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { facilities } from "../../db/schema/facilities";
import { adminProcedure, protectedProcedure, router } from "../trpc";

export const facilityRouter = router({
  // Public: List all active facilities (for residents to see)
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.select().from(facilities).where(eq(facilities.status, "active")).orderBy(desc(facilities.createdAt));
  }),

  // Admin: List all facilities (including maintenance/closed)
  adminList: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.select().from(facilities).orderBy(desc(facilities.createdAt));
  }),

  // Admin: Create a new facility
  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        capacity: z.number().min(1),
        openHour: z.number().min(0).max(23),
        closeHour: z.number().min(0).max(23),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.query.facilities.findFirst({
        where: eq(facilities.name, input.name),
      });

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A facility with this name already exists",
        });
      }

      return ctx.db.insert(facilities).values(input).returning();
    }),

  // Admin: Update facility
  update: adminProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        capacity: z.number().min(1).optional(),
        openHour: z.number().min(0).max(23).optional(),
        closeHour: z.number().min(0).max(23).optional(),
        status: z.enum(["active", "maintenance", "closed"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.update(facilities).set(data).where(eq(facilities.id, id)).returning();
    }),

  // Admin: Delete facility
  delete: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.delete(facilities).where(eq(facilities.id, input.id)).returning();
    }),
});
