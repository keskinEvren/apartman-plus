import { publicProcedure, router } from "../trpc";

export const financeRouter = router({
  getDues: publicProcedure.query(async ({ }) => {
    return [];
  }),
});
