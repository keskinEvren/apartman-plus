import { router } from "../trpc";
import { apartmentRouter } from "./apartment";
import { financeRouter } from "./finance";
import { opsRouter } from "./ops";
import { profileRouter } from "./profile";
import { socialRouter } from "./social";
import { userRouter } from "./user";

/**
 * Root tRPC Router
 * Register all sub-routers here
 */
import { authRouter } from "./auth";

import { notificationsRouter } from "./notifications";

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  apartment: apartmentRouter,
  finance: financeRouter,
  ops: opsRouter,
  ops: opsRouter,
  social: socialRouter,
  notifications: notificationsRouter,
  profile: profileRouter,
});

export type AppRouter = typeof appRouter;
