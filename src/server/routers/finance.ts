import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { units } from "../../db/schema/apartments";
import { duesTemplates, invoices, payments } from "../../db/schema/finance";
import { adminProcedure, router } from "../trpc";

export const financeRouter = router({
  // --- Dues Templates (Aidat Şablonları) ---

  getDuesTemplates: adminProcedure
    .input(z.object({ apartmentId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(duesTemplates)
        .where(eq(duesTemplates.apartmentId, input.apartmentId));
    }),

  createDuesTemplate: adminProcedure
    .input(
      z.object({
        apartmentId: z.string().uuid(),
        description: z.string().min(1),
        amount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid amount format"),
        dueDay: z.number().min(1).max(31),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [template] = await ctx.db
        .insert(duesTemplates)
        .values({
          apartmentId: input.apartmentId,
          description: input.description,
          amount: input.amount,
          dueDay: input.dueDay,
        })
        .returning();
      return template;
    }),

  // --- Invoices (Borçlar) ---

  getInvoices: adminProcedure
    .input(z.object({ apartmentId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
       // Join invoices with units to get unit info
       const results = await ctx.db
         .select({
            invoice: invoices,
            unit: units,
         })
         .from(invoices)
         .innerJoin(units, eq(invoices.unitId, units.id))
         .where(eq(units.apartmentId, input.apartmentId))
         .orderBy(desc(invoices.dueDate));
       
       return results;
    }),

  // Generate Invoices from Template (Bulk Action)
  generateBulkInvoices: adminProcedure
    .input(
      z.object({
        apartmentId: z.string().uuid(),
        templateId: z.string().uuid(),
        month: z.number().min(1).max(12),
        year: z.number().min(2024),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // 1. Get the template
      const [template] = await ctx.db
        .select()
        .from(duesTemplates)
        .where(eq(duesTemplates.id, input.templateId))
        .limit(1);

      if (!template) throw new Error("Template not found");

      // 2. Get all units in the apartment
      const apartmentUnits = await ctx.db
        .select()
        .from(units)
        .where(eq(units.apartmentId, input.apartmentId));

      if (apartmentUnits.length === 0) throw new Error("No units found");

      // 3. Create invoices for each unit
      const dueDate = new Date(input.year, input.month - 1, template.dueDay);
      
      // Determine description (e.g., "Ocak 2026 Aidatı")
      const monthName = new Date(input.year, input.month - 1, 1).toLocaleString('tr-TR', { month: 'long' });
      const description = `${monthName} ${input.year} - ${template.description}`;

      const newInvoices = apartmentUnits.map((unit) => ({
        unitId: unit.id,
        amount: template.amount,
        description: description,
        dueDate: dueDate,
        status: "pending" as const,
      }));

      await ctx.db.insert(invoices).values(newInvoices);

      return { success: true, count: newInvoices.length };
    }),
  // --- Payments (Tahsilat) ---

  addPayment: adminProcedure
    .input(z.object({
        invoiceId: z.string().uuid(),
        amount: z.string(),
        method: z.enum(["cash", "bank_transfer", "credit_card"]),
    }))
    .mutation(async ({ ctx, input }) => {
        // 1. Record payment
        const [payment] = await ctx.db.insert(payments).values({
            invoiceId: input.invoiceId,
            amount: input.amount,
            paymentMethod: input.method as "cash" | "bank_transfer" | "credit_card",
        }).returning();

        // 2. Update invoice status
        await ctx.db
          .update(invoices)
          .set({ status: "paid" })
          .where(eq(invoices.id, input.invoiceId));

        return payment;
    }),
});
