import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const userRouter = router({
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [user] = await ctx.db
        .select()
        .from(users)
        .where(eq(users.id, input.id));
      return user;
    }),

  me: protectedProcedure.query(async ({ ctx }) => {
    // In a real app, ctx.user would be populated. 
    // For now we might need to rely on input or mock.
    // Assuming context population is handled.
    return { id: "mock-id", role: "resident" as const }; // Placeholder
  }),

  updateProfile: protectedProcedure
    .input(z.object({
      fullName: z.string().min(2).optional(),
      phoneNumber: z.string().optional(),
      avatarUrl: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
       // Placeholder implementation
       // const userId = ctx.user.id;
       // await ctx.db.update(users)...
       return { success: true };
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.select().from(users);
  }),
});
