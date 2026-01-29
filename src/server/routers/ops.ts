import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { maintenanceTickets, ticketCategoryEnum, ticketUrgencyEnum } from "../../db/schema/ops";
import { adminProcedure, protectedProcedure, router } from "../trpc";

export const opsRouter = router({
  createTicket: protectedProcedure
    .input(z.object({
      title: z.string().min(3),
      description: z.string().min(10),
      category: z.enum(ticketCategoryEnum.enumValues),
      urgency: z.enum(ticketUrgencyEnum.enumValues),
      photoUrl: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(maintenanceTickets).values({
        requesterId: ctx.user.id,
        title: input.title,
        description: input.description,
        category: input.category,
        urgency: input.urgency,
        photoUrl: input.photoUrl,
      }).returning();
    }),

  getTickets: protectedProcedure
    .query(async ({ ctx }) => {
      // If admin, return all. If resident, return own.
      // Note: This logic depends on how 'admin' check is done. 
      // Based on previous files, adminProcedure is separate.
      // But here we might want a single endpoint with conditional logic or separate endpoints.
      // For now, let's just return own tickets for protectedProcedure.
      // Admin verification usually implies a separate procedure or a check.
      
      const is_admin = ctx.user.role === 'admin'; 

      if (is_admin) {
           return await ctx.db.select().from(maintenanceTickets).orderBy(desc(maintenanceTickets.createdAt));
      } else {
           return await ctx.db.select().from(maintenanceTickets)
             .where(eq(maintenanceTickets.requesterId, ctx.user.id))
             .orderBy(desc(maintenanceTickets.createdAt));
      }
    }),
    
  updateTicketStatus: adminProcedure
    .input(z.object({
        ticketId: z.string().uuid(),
        status: z.enum(["open", "approved", "in_progress", "resolved", "cancelled"]),
    }))
    .mutation(async ({ ctx, input }) => {
        return await ctx.db.update(maintenanceTickets)
            .set({ status: input.status, updatedAt: new Date() })
            .where(eq(maintenanceTickets.id, input.ticketId))
            .returning();
    }),
});
