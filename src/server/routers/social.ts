import { publicProcedure, router } from "../trpc";

export const socialRouter = router({
  getAnnouncements: publicProcedure.query(async ({ }) => {
    return [];
  }),
});
