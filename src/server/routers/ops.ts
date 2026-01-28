import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const opsRouter = router({
  createTicket: publicProcedure
    .input(z.object({ title: z.string(), description: z.string() }))
    .mutation(async ({ input }) => {
      return { success: true };
    }),
});
