import { TRPCError } from "@trpc/server";
import { and, count, eq, gte, sql } from "drizzle-orm";
import { z } from "zod";
import { facilities, reservations } from "../../db/schema/facilities";
import { protectedProcedure, router } from "../trpc";

export const reservationRouter = router({
  // Resident: Create a reservation
  create: protectedProcedure
    .input(
      z.object({
        facilityId: z.string().uuid(),
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

      const startHour = startTime.getHours();
      const endHour = endTime.getHours();
      
      // Handle crossing midnight exception if needed, but for now strict day hours
      if (startHour < facility.openHour || endHour > facility.closeHour || (endHour === facility.closeHour && endTime.getMinutes() > 0)) {
         throw new TRPCError({ code: "BAD_REQUEST", message: `Facility is open between ${facility.openHour}:00 and ${facility.closeHour}:00` });
      }

      // 3. User Quota: Max 2 pending/approved reservations
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

      // 4. Capacity Check (Overlapping reservations)
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

      // 5. Create Reservation
      return ctx.db.insert(reservations).values({
        userId,
        facilityId: input.facilityId,
        startTime,
        endTime,
        status: "approved", // Auto-approve for now, can be changed to pending if needed
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
});
