import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const invitations = pgTable("invitations", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  role: varchar("role", { length: 50 }).notNull().default("resident"),
  apartmentId: uuid("apartment_id"), // Optional: Link to apartment
  status: varchar("status", { length: 20 }).default("pending"), // pending, accepted, expired, revoked
  expiresAt: timestamp("expires_at").notNull(),
  invitedBy: uuid("invited_by").notNull(), // Admin ID
  createdAt: timestamp("created_at").defaultNow(),
});
