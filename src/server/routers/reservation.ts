import { TRPCError } from "@trpc/server";
import { and, count, eq, gte, sql } from "drizzle-orm";
import { z } from "zod";
import { facilities, reservations } from "../../db/schema/facilities";
import { facilitySessions } from "../../db/schema/facility_sessions";
import { protectedProcedure, router } from "../trpc";

export const reservationRouter = router({
  // Resident: Create a reservation (supports both hourly and session-based)
  create: protectedProcedure
    .input(
      z.object({
        facilityId: z.string().uuid(),
        sessionId: z.string().uuid().optional(), // For session-based booking
        startTime: z.string().datetime(), // ISO string from frontend
        endTime: z.string().datetime(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const startTime = new Date(input.startTime);
      const endTime = new Date(input.endTime);

      // 1. Basic Validation
      if (startTime >= endTime) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "End time must be after start time" });
      }

      // 2. Check Facility Existence & Hours
      const facility = await ctx.db.query.facilities.findFirst({
        where: eq(facilities.id, input.facilityId),
      });

      if (!facility) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Facility not found" });
      }

      if (facility.status !== "active") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Facility is not active" });
      }

      // 3. If session-based, validate session exists and is active
      if (input.sessionId) {
        const session = await ctx.db.query.facilitySessions.findFirst({
          where: eq(facilitySessions.id, input.sessionId),
        });

        if (!session || !session.isActive) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Session not found or inactive" });
        }
      } else {
        // Hourly validation (legacy)
        const startHour = startTime.getHours();
        const endHour = endTime.getHours();
        
        if (startHour < facility.openHour || endHour > facility.closeHour || (endHour === facility.closeHour && endTime.getMinutes() > 0)) {
           throw new TRPCError({ code: "BAD_REQUEST", message: `Facility is open between ${facility.openHour}:00 and ${facility.closeHour}:00` });
        }
      }

      // 4. User Quota: Max 2 pending/approved reservations
      const userActiveReservations = await ctx.db
        .select({ count: count() })
        .from(reservations)
        .where(
          and(
            eq(reservations.userId, userId),
            sql`${reservations.status} IN ('pending', 'approved')`,
            gte(reservations.endTime, new Date()) // Only future/current ones
          )
        );

      if (userActiveReservations[0].count >= 2) {
        throw new TRPCError({ code: "FORBIDDEN", message: "You have reached the maximum limit of 2 active reservations." });
      }

      // 5. Capacity Check (Overlapping reservations) - uses facility-wide capacity
      const existingReservations = await ctx.db
        .select({ count: count() })
        .from(reservations)
        .where(
          and(
            eq(reservations.facilityId, input.facilityId),
            sql`${reservations.status} IN ('pending', 'approved')`,
            // Overlapping logic: (StartA < EndB) and (EndA > StartB)
            sql`${reservations.startTime} < ${endTime.toISOString()} AND ${reservations.endTime} > ${startTime.toISOString()}`
          )
        );

      if (existingReservations[0].count >= facility.capacity) {
        throw new TRPCError({ code: "CONFLICT", message: "Facility is fully booked for this time slot." });
      }

      // 6. Create Reservation
      return ctx.db.insert(reservations).values({
        userId,
        facilityId: input.facilityId,
        sessionId: input.sessionId,
        startTime,
        endTime,
        status: "approved", // Auto-approve for now
      }).returning();
    }),

  // Resident: List my reservations
  myReservations: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.reservations.findMany({
      where: eq(reservations.userId, ctx.user.id),
      with: {
        facility: true,
      },
      orderBy: (reservations, { desc }) => [desc(reservations.startTime)],
    });
  }),

  // Resident: Cancel reservation
  cancel: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const reservation = await ctx.db.query.reservations.findFirst({
        where: eq(reservations.id, input.id),
      });

      if (!reservation) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Reservation not found" });
      }

      if (reservation.userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "You can only cancel your own reservations" });
      }

      return ctx.db
        .update(reservations)
        .set({ status: "cancelled" })
        .where(eq(reservations.id, input.id))
        .returning();
    }),

  // Get occupancy for a specific session on a specific date
  getSessionOccupancy: protectedProcedure
    .input(
      z.object({
        facilityId: z.string().uuid(),
        sessionId: z.string().uuid(),
        date: z.string().datetime(), // The date to check (ISO string)
      })
    )
    .query(async ({ ctx, input }) => {
      const targetDate = new Date(input.date);
      const dayStart = new Date(targetDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(targetDate);
      dayEnd.setHours(23, 59, 59, 999);

      // Get the session to know its time range
      const session = await ctx.db.query.facilitySessions.findFirst({
        where: eq(facilitySessions.id, input.sessionId),
      });

      if (!session) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Session not found" });
      }

      // Get the facility to know capacity
      const facility = await ctx.db.query.facilities.findFirst({
        where: eq(facilities.id, input.facilityId),
      });

      if (!facility) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Facility not found" });
      }

      // Count approved reservations for this session on this date
      const activeReservations = await ctx.db
        .select({ count: count() })
        .from(reservations)
        .where(
          and(
            eq(reservations.facilityId, input.facilityId),
            eq(reservations.sessionId, input.sessionId),
            sql`${reservations.status} IN ('pending', 'approved')`,
            sql`${reservations.startTime} >= ${dayStart.toISOString()}`,
            sql`${reservations.endTime} <= ${dayEnd.toISOString()}`
          )
        );

      const currentCount = activeReservations[0].count;
      const capacity = facility.capacity;

      return {
        sessionId: input.sessionId,
        currentCount,
        capacity,
        remainingSlots: Math.max(0, capacity - currentCount),
        isFull: currentCount >= capacity,
      };
    }),
});

