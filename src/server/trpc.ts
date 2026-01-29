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
      
      const user = await ctx.db.query.users.findFirst({
          where: eq(users.id, decoded.userId)
      });

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
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid token" });
  }
});

export const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const role = ctx.user.role as string;
  if (role !== 'admin' && role !== 'super_admin') {
     // For dev, strict check might block if we picked a random user. 
     // Let's warn but allow if we just want to test, OR enforce it.
     // Enforcing it is better behavior.
     if(process.env.NODE_ENV !== 'development') {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
     }
     
     if (role !== 'admin' && role !== 'super_admin') {
         throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
     }
  }
  return next();
});

