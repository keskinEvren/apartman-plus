import { pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";

export const userTypeEnum = pgEnum("user_type", ["owner", "tenant"]);

export const apartments = pgTable("apartments", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  subscriptionType: text("subscription_type").notNull().default("standard"),
});

export const units = pgTable("units", {
  id: uuid("id").primaryKey().defaultRandom(),
  apartmentId: uuid("apartment_id")
    .references(() => apartments.id)
    .notNull(),
  blockName: text("block_name"),
  unitNumber: text("unit_number").notNull(),
});

export const unitAssignments = pgTable("unit_assignments", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  unitId: uuid("unit_id")
    .references(() => units.id)
    .notNull(),
  userType: userTypeEnum("user_type").notNull(),
});

export type Apartment = typeof apartments.$inferSelect;
export type Unit = typeof units.$inferSelect;
export type UnitAssignment = typeof unitAssignments.$inferSelect;
