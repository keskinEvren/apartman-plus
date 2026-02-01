import { TRPCError } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { facilities } from "../../db/schema/facilities";
import { facilitySessions } from "../../db/schema/facility_sessions";
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
        useSessions: z.boolean().optional().default(false),
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
        useSessions: z.boolean().optional(),
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

  // ============ SESSION MANAGEMENT ============

  // List sessions for a facility (public for residents to see available slots)
  listSessions: protectedProcedure
    .input(z.object({ facilityId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db
        .select()
        .from(facilitySessions)
        .where(eq(facilitySessions.facilityId, input.facilityId))
        .orderBy(facilitySessions.startTime);
    }),

  // Admin: Create a new session for a facility
  createSession: adminProcedure
    .input(
      z.object({
        facilityId: z.string().uuid(),
        name: z.string().min(1),
        startTime: z.string().regex(/^\d{2}:\d{2}$/), // HH:MM format
        endTime: z.string().regex(/^\d{2}:\d{2}$/),
        daysOfWeek: z.array(z.number().min(0).max(6)).default([0, 1, 2, 3, 4, 5, 6]),
        isActive: z.boolean().default(true),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify facility exists
      const facility = await ctx.db.query.facilities.findFirst({
        where: eq(facilities.id, input.facilityId),
      });

      if (!facility) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Facility not found" });
      }

      return ctx.db.insert(facilitySessions).values(input).returning();
    }),

  // Admin: Update a session
  updateSession: adminProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).optional(),
        startTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
        endTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
        daysOfWeek: z.array(z.number().min(0).max(6)).optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.update(facilitySessions).set(data).where(eq(facilitySessions.id, id)).returning();
    }),

  // Admin: Delete a session
  deleteSession: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.delete(facilitySessions).where(eq(facilitySessions.id, input.id)).returning();
    }),
});

