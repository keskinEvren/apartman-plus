import { router } from "../trpc";
import { apartmentRouter } from "./apartment";
import { financeRouter } from "./finance";
import { opsRouter } from "./ops";
import { socialRouter } from "./social";
import { userRouter } from "./user";

/**
 * Root tRPC Router
 * Register all sub-routers here
 */
import { authRouter } from "./auth";

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  apartment: apartmentRouter,
  finance: financeRouter,
  ops: opsRouter,
  social: socialRouter,
});

export type AppRouter = typeof appRouter;
