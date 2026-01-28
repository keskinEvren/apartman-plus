import { publicProcedure, router } from "../trpc";

export const apartmentRouter = router({
  list: publicProcedure.query(async ({ }) => {
    return [];
  }),
});
