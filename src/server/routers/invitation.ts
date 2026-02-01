import { db } from "@/db";
import { invitations } from "@/db/schema/invitations";
import { users } from "@/db/schema/users";
import { emailService } from "@/lib/email";
import { TRPCError } from "@trpc/server";
import crypto from "crypto";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { adminProcedure, publicProcedure, router } from "../trpc";

export const invitationRouter = router({
  // Create an invitation (Admin Only)
  create: adminProcedure
    .input(z.object({
      email: z.string().email(),
      role: z.enum(["admin", "resident", "security"]).default("resident"),
      apartmentId: z.string().uuid().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Check if user already exists
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, input.email)
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exists with this email"
        });
      }

      // Check if pending invite exists
      const existingInvite = await db.query.invitations.findFirst({
        where: and(
            eq(invitations.email, input.email),
            eq(invitations.status, "pending")
        )
      });
      
      if (existingInvite) {
         throw new TRPCError({
          code: "CONFLICT",
          message: "Pending invitation already exists for this email"
        });
      }

      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

      // Create invitation
      const [invite] = await db.insert(invitations).values({
        email: input.email,
        role: input.role,
        apartmentId: input.apartmentId, // Assuming passed as null/undefined if not set
        token,
        status: "pending",
        expiresAt,
        invitedBy: ctx.user.id
      }).returning();

      // Send email (Mock)
      await emailService.sendInvitation(input.email, token, input.role);

      return invite;
    }),

  // List all invitations (Admin Only)
  getAll: adminProcedure.query(async () => {
    return await db.select().from(invitations).orderBy(invitations.createdAt);
  }),

  // Revoke invitation (Admin Only)
  revoke: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      await db
        .update(invitations)
        .set({ status: "revoked" })
        .where(eq(invitations.id, input.id));
      return { success: true };
    }),

  // Get invitation details (Public - for Registration page)
  getDetails: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const invite = await db.query.invitations.findFirst({
        where: and(
            eq(invitations.token, input.token),
            eq(invitations.status, "pending")
        )
      });

      if (!invite || new Date() > invite.expiresAt) {
         throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invalid or expired invitation"
        });
      }

      return {
        email: invite.email,
        role: invite.role,
        apartmentId: invite.apartmentId
      };
    })
});
