import { relations } from "drizzle-orm";
import { integer, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";

export const facilityStatusEnum = pgEnum("facility_status", ["active", "maintenance", "closed"]);
export const reservationStatusEnum = pgEnum("reservation_status", ["pending", "approved", "cancelled", "completed", "rejected"]);

export const facilities = pgTable("facilities", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  description: text("description"),
  capacity: integer("capacity").notNull().default(1),
  openHour: integer("open_hour").notNull().default(8), // 8 means 08:00
  closeHour: integer("close_hour").notNull().default(22), // 22 means 22:00
  status: facilityStatusEnum("status").default("active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const reservations = pgTable("reservations", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id),
  facilityId: uuid("facility_id").notNull().references(() => facilities.id),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  status: reservationStatusEnum("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const facilitiesRelations = relations(facilities, ({ many }) => ({
  reservations: many(reservations),
}));

export const reservationsRelations = relations(reservations, ({ one }) => ({
  facility: one(facilities, {
    fields: [reservations.facilityId],
    references: [facilities.id],
  }),
  user: one(users, {
    fields: [reservations.userId],
    references: [users.id],
  }),
}));
