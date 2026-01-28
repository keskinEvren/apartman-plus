import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";

export const ticketStatusEnum = pgEnum("ticket_status", ["open", "approved", "in_progress", "resolved", "cancelled"]);
export const ticketUrgencyEnum = pgEnum("ticket_urgency", ["low", "medium", "critical"]);
export const ticketCategoryEnum = pgEnum("ticket_category", ["plumbing", "electrical", "elevator", "cleaning", "other"]);

export const maintenanceTickets = pgTable("maintenance_tickets", {
  id: uuid("id").primaryKey().defaultRandom(),
  requesterId: uuid("requester_id")
    .references(() => users.id)
    .notNull(),
  assignedToId: uuid("assigned_to_id").references(() => users.id),
  category: ticketCategoryEnum("category").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: ticketStatusEnum("status").notNull().default("open"),
  urgency: ticketUrgencyEnum("urgency").notNull().default("medium"),
  photoUrl: text("photo_url"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type MaintenanceTicket = typeof maintenanceTickets.$inferSelect;
