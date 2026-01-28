import { db } from "@/db";
import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

/**
 * Create context for tRPC requests
 * This runs for every request and provides context to all procedures
 */
export const createContext = async () => {
  return {
    db,
    // Add user session here when auth is implemented
    // user: await getUser(req),
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

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
  // TODO: Implement proper JWT extraction from context headers
  // For now, we will rely on client passing the user object or validated session
  // In a real Next.js App Router setup, we'd parse headers() in createContext
  
  // Checking if context has user (mock implementation for now until context is updated)
  // const user = ctx.user;
  
  // if (!user) {
  //   throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
  // }

  return next({
    ctx: {
      ...ctx,
      // user,
    },
  });
});

export const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  // if (ctx.user.role !== 'admin' && ctx.user.role !== 'super_admin') {
  //   throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  // }
  return next();
});
