import { db } from "@/db";
import { users } from "@/db/schema/users";
import { initTRPC, TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import superjson from "superjson";
import { ZodError } from "zod";

/**
 * Create context for tRPC requests
 * This runs for every request and provides context to all procedures
 */
export const createContext = async (opts?: { req?: Request, headers?: Headers }) => {
  return {
    db,
    headers: opts?.headers || opts?.req?.headers,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>> & {
    user?: typeof users.$inferSelect;
};

/**
 * Initialize tRPC with context and superjson transformer
 */
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Export reusable router and procedure helpers
 */
export const router = t.router;
export const publicProcedure = t.procedure;

/**
 * Protected procedure - requires authentication
 * Checks for valid session/JWT token
 */
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  const authHeader = ctx.headers?.get("authorization");
  if (!authHeader) {
     throw new TRPCError({ code: "UNAUTHORIZED", message: "No authorization header found" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
     throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid token format" });
  }

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret") as { userId: string };
      
      const [user] = await ctx.db.select()
        .from(users)
        .where(eq(users.id, decoded.userId))
        .limit(1);

      if (!user) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "User not found" });
      }

      return next({
        ctx: {
          ...ctx,
          user,
        },
      });

  } catch (err) {
      console.log("DEBUG AUTH ERROR:", err);
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid token" });
  }
});

export const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const role = ctx.user.role as string;
  if (role !== 'admin' && role !== 'super_admin') {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next();
});

// Super Admin only procedure
export const superAdminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const role = ctx.user.role as string;
  if (role !== 'super_admin') {
      throw new TRPCError({ code: "FORBIDDEN", message: "Super Admin access required" });
  }
  return next();
});


