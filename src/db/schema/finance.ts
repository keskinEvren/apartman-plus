import { integer, numeric, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { apartments, units } from "./apartments";

export const invoiceStatusEnum = pgEnum("invoice_status", ["pending", "paid", "overdue", "cancelled"]);
export const paymentMethodEnum = pgEnum("payment_method", ["credit_card", "bank_transfer", "cash"]);

export const duesTemplates = pgTable("dues_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  apartmentId: uuid("apartment_id")
    .references(() => apartments.id)
    .notNull(),
  amount: numeric("amount").notNull(),
  description: text("description").notNull(),
  dueDay: integer("due_day").notNull(), // Day of month (1-31)
});

export const invoices = pgTable("invoices", {
  id: uuid("id").primaryKey().defaultRandom(),
  unitId: uuid("unit_id")
    .references(() => units.id)
    .notNull(),
  description: text("description").notNull(),
  amount: numeric("amount").notNull(),
  status: invoiceStatusEnum("status").notNull().default("pending"),
  dueDate: timestamp("due_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  invoiceId: uuid("invoice_id")
    .references(() => invoices.id)
    .notNull(),
  amount: numeric("amount").notNull(),
  paymentMethod: paymentMethodEnum("payment_method").notNull(),
  transactionId: text("transaction_id"),
  paidAt: timestamp("paid_at").defaultNow().notNull(),
});

export type Invoice = typeof invoices.$inferSelect;
export type Payment = typeof payments.$inferSelect;
