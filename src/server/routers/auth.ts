import { db } from "@/db";
import { users } from "@/db/schema/users";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const authRouter = router({
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
        fullName: z.string().min(2),
        phoneNumber: z.string().optional(),
        role: z.enum(["super_admin", "admin", "resident", "security"]).optional(),
        invitationToken: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { email, password, fullName, phoneNumber, role, invitationToken } = input;

      // 1. Check if user already exists
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exists",
        });
      }

      let finalRole = role || "resident";
      
      // 2. Handle Invitation
      if (invitationToken) {
        const { invitations } = await import("@/db/schema/invitations");
        const { and, eq } = await import("drizzle-orm");
        
        const invite = await db.query.invitations.findFirst({
            where: and(
                eq(invitations.token, invitationToken),
                eq(invitations.status, "pending")
            )
        });

        if (!invite) {
             throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid or expired invitation" });
        }

        if (new Date() > invite.expiresAt) {
             throw new TRPCError({ code: "BAD_REQUEST", message: "Invitation expired" });
        }
        
        if (invite.email !== email) {
             throw new TRPCError({ code: "BAD_REQUEST", message: "Email does not match invitation" });
        }

        finalRole = invite.role as any;
        
        // Mark as accepted
        await db.update(invitations)
            .set({ status: "accepted" })
            .where(eq(invitations.id, invite.id));
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const [user] = await db
        .insert(users)
        .values({
          email,
          password: hashedPassword,
          fullName,
          phoneNumber,
          role: finalRole as any,
        })
        .returning();

      return { success: true, userId: user.id };
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { email, password } = input;

      const user = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET || "default_secret",
        { expiresIn: "1d" }
      );

      return {
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        },
      };
    }),
});
