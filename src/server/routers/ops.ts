import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { notifications } from "../../db/schema/notifications";
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
    .input(z.object({
      limit: z.number().min(1).max(100).nullish(),
    }).optional())
    .query(async ({ ctx, input }) => {
      const limit = input?.limit ?? 50;
      const is_admin = ctx.user.role === 'admin' || ctx.user.role === 'super_admin'; 

      if (is_admin) {
           return await ctx.db.select()
             .from(maintenanceTickets)
             .orderBy(desc(maintenanceTickets.createdAt))
             .limit(limit);
      } else {
           return await ctx.db.select()
             .from(maintenanceTickets)
             .where(eq(maintenanceTickets.requesterId, ctx.user.id))
             .orderBy(desc(maintenanceTickets.createdAt))
             .limit(limit);
      }
    }),
    
  updateTicketStatus: adminProcedure
    .input(z.object({
        ticketId: z.string().uuid(),
        status: z.enum(["open", "approved", "in_progress", "resolved", "cancelled"]),
    }))
    .mutation(async ({ ctx, input }) => {
        const [ticket] = await ctx.db.update(maintenanceTickets)
            .set({ status: input.status, updatedAt: new Date() })
            .where(eq(maintenanceTickets.id, input.ticketId))
            .returning();

        // Notify the requester
        if (ticket) {
            await ctx.db.insert(notifications).values({
                userId: ticket.requesterId,
                title: "Talep Güncellemesi",
                message: `Talep durumu güncellendi: ${input.status}`,
                type: "info",
                link: `/dashboard/resident/requests` // Assuming resident implementation
            });
        }
        
        return ticket;
    }),
});
