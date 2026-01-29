import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { notifications } from "../../db/schema/notifications";
import { protectedProcedure, router } from "../trpc";

export const notificationsRouter = router({
  getNotifications: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(50).nullish(), // Enforcing SAFE LIMIT as requested by user
    }).optional())
    .query(async ({ ctx, input }) => {
      const limit = input?.limit ?? 20; // Default to 20, max 50
      
      return await ctx.db.select()
        .from(notifications)
        .where(eq(notifications.userId, ctx.user.id))
        .orderBy(desc(notifications.createdAt))
        .limit(limit);
    }),

  getUnreadCount: protectedProcedure
    .query(async ({ ctx }) => {
       const result = await ctx.db.select({
           id: notifications.id,
           isRead: notifications.isRead
       }).from(notifications)
         .where(eq(notifications.userId, ctx.user.id));
         
       // Counting in JS for now as Drizzle count() can be verbose, optimization later
       return result.filter(n => !n['isRead']).length;
    }),

  markAsRead: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.update(notifications)
        .set({ isRead: true })
        .where(eq(notifications.id, input.id));
      return { success: true };
    }),

  markAllAsRead: protectedProcedure
    .mutation(async ({ ctx }) => {
      await ctx.db.update(notifications)
        .set({ isRead: true })
        .where(eq(notifications.userId, ctx.user.id));
      return { success: true };
    }),
});
