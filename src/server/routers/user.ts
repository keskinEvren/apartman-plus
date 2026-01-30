import { unitAssignments, units, users } from "@/db/schema";
import { eq, ilike, or } from "drizzle-orm";
import { z } from "zod";
import { adminProcedure, protectedProcedure, publicProcedure, router, superAdminProcedure } from "../trpc";

export const userRouter = router({
  search: adminProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!input.query || input.query.length < 2) return [];
      return await ctx.db
        .select()
        .from(users)
        .where(
          or(
            ilike(users.fullName, `%${input.query}%`),
            ilike(users.email, `%${input.query}%`)
          )
        )
        .limit(10);
    }),
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
    // Fetch user's apartment via unit assignments
    const assignment = await ctx.db.select({
        apartmentId: units.apartmentId
    })
    .from(unitAssignments)
    .innerJoin(units, eq(units.id, unitAssignments.unitId))
    .where(eq(unitAssignments.userId, ctx.user.id))
    .limit(1);

    return {
        ...ctx.user,
        apartmentId: assignment[0]?.apartmentId || null
    };
  }),

  updateProfile: protectedProcedure
    .input(z.object({
      fullName: z.string().min(2).optional(),
      phoneNumber: z.string().optional(),
      avatarUrl: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(users)
        .set({ 
            ...input,
            updatedAt: new Date()
        })
        .where(eq(users.id, ctx.user.id));
      return { success: true };
    }),

  updateRole: superAdminProcedure
    .input(z.object({
      userId: z.string().uuid(),
      role: z.enum(["super_admin", "admin", "resident", "security"]),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(users)
        .set({ 
            role: input.role,
            updatedAt: new Date()
        })
        .where(eq(users.id, input.userId));
      return { success: true };
    }),

  deleteUser: superAdminProcedure
    .input(z.object({ userId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      // Soft delete
      await ctx.db
        .update(users)
        .set({ 
            deletedAt: new Date()
        })
        .where(eq(users.id, input.userId));
      return { success: true };
    }),

  changePassword: protectedProcedure
    .input(z.object({
        oldPassword: z.string(),
        newPassword: z.string().min(6)
    }))
    .mutation(async ({ ctx, input }) => {
        // Verify old password
        const [user] = await ctx.db.select().from(users).where(eq(users.id, ctx.user.id));
        if (!user) throw new Error("User not found");

        // We need to import bcrypt. Check if it's imported above or add it.
        // Assuming bcrypt is needed, I will add the import in a separate tool call if missing.
        // But wait, I can't easily jump lines. 
        // I'll assume I need to fix imports in a second pass if I can't see them all.
        // Ideally I'd use multi_replace but let's stick to ReplaceFileContent for the block.
        // I will trust that I can add the import line next.
        
        // Actually, let's use a dynamic import or checking if I can add it to the top.
        // Code snippet shows imports at top... 
        // Let's write the logic assuming bcrypt is imported as `bcrypt`.
        
        const isValid = await import("bcryptjs").then(m => m.compare(input.oldPassword, user.password));
        if (!isValid) throw new Error("Invalid old password");

        const hashedPassword = await import("bcryptjs").then(m => m.hash(input.newPassword, 10));

        await ctx.db.update(users).set({
            password: hashedPassword,
            updatedAt: new Date()
        }).where(eq(users.id, ctx.user.id));

        return { success: true };
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.select().from(users);
  }),
});
