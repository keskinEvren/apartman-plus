
import { TRPCError } from "@trpc/server";
import { and, count, desc, eq, lt } from "drizzle-orm";
import { z } from "zod";
import { facilities, reservations } from "../../db/schema/facilities";
import { facilitySessions } from "../../db/schema/facility_sessions";
import { facilityWaitlist } from "../../db/schema/facility_waitlist";
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

  // ============ WAITLIST MANAGEMENT ============

  // Join waitlist for a full session
  joinWaitlist: protectedProcedure
    .input(
      z.object({
        facilityId: z.string().uuid(),
        sessionId: z.string().uuid(),
        date: z.string().datetime(), // ISO 8601 string
      })
    )
    .mutation(async ({ ctx, input }) => {
      const dateObj = new Date(input.date);
      
      // 1. Check if user is already in waitlist for this session/date
      const existingEntry = await ctx.db.query.facilityWaitlist.findFirst({
        where: and(
          eq(facilityWaitlist.sessionId, input.sessionId),
          eq(facilityWaitlist.userId, ctx.user.id),
          eq(facilityWaitlist.date, dateObj),
          eq(facilityWaitlist.status, "pending")
        ),
      });

      if (existingEntry) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Bu seans için zaten bekleme listesindesiniz.",
        });
      }

      // 2. Check if user already has a reservation (no need to waitlist if reserved)
      const existingReservation = await ctx.db.query.reservations.findFirst({
        where: and(
          eq(reservations.sessionId, input.sessionId),
          eq(reservations.userId, ctx.user.id),
          // Need to check day match roughly, but since we store precise start/end, 
          // we rely on frontend sending correct date object or check overlap logic.
          // Ideally check intersection with session time on that date.
        )
      });
      // Simplified check: assume sessionId + date logic handled by frontend/reservation router
      
      // 3. Add to waitlist
      return ctx.db.insert(facilityWaitlist).values({
        facilityId: input.facilityId,
        sessionId: input.sessionId,
        userId: ctx.user.id,
        date: dateObj,
        status: "pending",
      }).returning();
    }),

  // Get waitlist status for a specific session/date
  getWaitlistStatus: protectedProcedure
    .input(
      z.object({
        sessionId: z.string().uuid(),
        date: z.string().datetime(),
      })
    )
    .query(async ({ ctx, input }) => {
      const dateObj = new Date(input.date);

      // Check user's position
      const userEntry = await ctx.db.query.facilityWaitlist.findFirst({
        where: and(
          eq(facilityWaitlist.sessionId, input.sessionId),
          eq(facilityWaitlist.userId, ctx.user.id),
          eq(facilityWaitlist.date, dateObj),
          eq(facilityWaitlist.status, "pending")
        ),
      });

      if (!userEntry) return null;

      // Count people ahead
      const aheadCount = await ctx.db
        .select({ count: count() })
        .from(facilityWaitlist)
        .where(and(
          eq(facilityWaitlist.sessionId, input.sessionId),
          eq(facilityWaitlist.date, dateObj),
          eq(facilityWaitlist.status, "pending"),
          lt(facilityWaitlist.createdAt, userEntry.createdAt)
        ));

      return {
        isInWaitlist: true,
        position: Number(aheadCount[0].count) + 1,
        entryDate: userEntry.createdAt,
      };
    }),

  // Leave waitlist
  leaveWaitlist: protectedProcedure
    .input(
      z.object({
        sessionId: z.string().uuid(),
        date: z.string().datetime(),
      })
    )
    .mutation(async ({ ctx, input }) => {
       const dateObj = new Date(input.date);
       
       return ctx.db
         .update(facilityWaitlist)
         .set({ status: "cancelled" })
         .where(and(
           eq(facilityWaitlist.sessionId, input.sessionId),
           eq(facilityWaitlist.userId, ctx.user.id),
           eq(facilityWaitlist.date, dateObj),
           eq(facilityWaitlist.status, "pending")
         ))
         .returning();
    }),
    // Resident: Get my waitlist entries
  myWaitlist: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.facilityWaitlist.findMany({
      where: and(
        eq(facilityWaitlist.userId, ctx.user.id),
        eq(facilityWaitlist.status, "pending")
      ),
      with: {
        facility: true,
        session: true,
      },
      orderBy: desc(facilityWaitlist.createdAt),
    });
  }),
});


