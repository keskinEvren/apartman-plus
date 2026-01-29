import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { announcements } from "../../db/schema/social";
import { adminProcedure, protectedProcedure, router } from "../trpc";

export const socialRouter = router({
  getAnnouncements: protectedProcedure
    .input(z.object({ apartmentId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.select()
        .from(announcements)
        .where(eq(announcements.apartmentId, input.apartmentId))
        .orderBy(desc(announcements.createdAt));
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
