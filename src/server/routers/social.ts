import { desc, eq } from "drizzle-orm";
import { z } from "zod";
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
        return await ctx.db.insert(announcements).values({
            apartmentId: input.apartmentId,
            authorId: ctx.user.id,
            title: input.title,
            content: input.content
        }).returning();
    }),
});
