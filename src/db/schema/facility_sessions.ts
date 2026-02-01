import { relations, sql } from "drizzle-orm";
import { boolean, integer, pgTable, time, uuid, varchar } from "drizzle-orm/pg-core";
import { facilities } from "./facilities";

/**
 * Facility Sessions - Admin-defined time slots for facility reservations
 * 
 * Example: "Sabah Seansı" for Pool, 09:00-11:00, Monday-Friday
 */
export const facilitySessions = pgTable("facility_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  facilityId: uuid("facility_id").notNull().references(() => facilities.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(), // e.g., "Sabah Seansı"
  startTime: time("start_time").notNull(), // e.g., "09:00"
  endTime: time("end_time").notNull(), // e.g., "11:00"
  daysOfWeek: integer("days_of_week").array().notNull().default(sql`ARRAY[0, 1, 2, 3, 4, 5, 6]`), // 0=Sun, 6=Sat
  isActive: boolean("is_active").notNull().default(true),
});

export const facilitySessionsRelations = relations(facilitySessions, ({ one }) => ({
  facility: one(facilities, {
    fields: [facilitySessions.facilityId],
    references: [facilities.id],
  }),
}));
