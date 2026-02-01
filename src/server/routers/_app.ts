import { router } from "../trpc";
import { apartmentRouter } from "./apartment";
import { authRouter } from "./auth";
import { financeRouter } from "./finance";
import { invitationRouter } from "./invitation";
import { notificationsRouter } from "./notifications";
import { opsRouter } from "./ops";
import { profileRouter } from "./profile";
import { socialRouter } from "./social";
import { userRouter } from "./user";

/**
 * Root tRPC Router
 * Register all sub-routers here
 */

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  apartment: apartmentRouter,
  finance: financeRouter,
  ops: opsRouter,
  social: socialRouter,
  notifications: notificationsRouter,
  profile: profileRouter,
  invitation: invitationRouter,
});

export type AppRouter = typeof appRouter;
