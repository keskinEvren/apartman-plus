import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { units } from "../../db/schema/apartments";
import { notifications } from "../../db/schema/notifications";
import { announcements } from "../../db/schema/social";
import { adminProcedure, protectedProcedure, router } from "../trpc";

export const socialRouter = router({
  getAnnouncements: protectedProcedure
    .input(z.object({ 
      apartmentId: z.string().uuid(),
      limit: z.number().min(1).max(100).nullish(), // Optional limit, safe default
      cursor: z.string().nullish(), // For future infinite scroll support
    }))
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50; // Default hard limit
      
      return await ctx.db.select()
        .from(announcements)
        .where(eq(announcements.apartmentId, input.apartmentId))
        .orderBy(desc(announcements.createdAt))
        .limit(limit);
    }),

  createAnnouncement: adminProcedure
    .input(z.object({
        apartmentId: z.string().uuid(),
        title: z.string().min(3),
        content: z.string().min(10),
    }))
    .mutation(async ({ ctx, input }) => {
        const [announcement] = await ctx.db.insert(announcements).values({
            apartmentId: input.apartmentId,
            authorId: ctx.user.id,
            title: input.title,
            content: input.content
        }).returning();

        // Metadata for notification
        // Find all residents in this apartment to notify
        // This query might need refinement depending on tenant/owner logic in `unit_assignments`
        // For now, let's find all users assigned to units in this apartment.
        
        // This requires joining units -> unit_assignments -> users.
        // Or simpler: Select unit assignments where unit.apartmentId = input.apartmentId
        
        // Note: Complex joins might be needed. Let's do a raw SQL or separate queries for MVP simplicity and safety.
        // Step 1: Get all unit IDs in this apartment
        const apartmentUnits = await ctx.db.query.units.findMany({
            where: eq(units.apartmentId, input.apartmentId),
            with: {
                assignments: true
            }
        });

        const userIdsToNotify = new Set<string>();
        for (const unit of apartmentUnits) {
            for (const assignment of unit.assignments) {
                userIdsToNotify.add(assignment.userId);
            }
        }

        if (userIdsToNotify.size > 0) {
            await ctx.db.insert(notifications).values(
                Array.from(userIdsToNotify).map(userId => ({
                    userId,
                    title: `Yeni Duyuru: ${input.title}`,
                    message: input.content.substring(0, 50) + "...",
                    type: "info" as const,
                    link: `/dashboard/resident/announcements`
                }))
            );
        }

        return announcement;
    }),
});
