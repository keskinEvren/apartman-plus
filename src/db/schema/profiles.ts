import { boolean, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";

export const petTypeEnum = pgEnum("pet_type", ["DOG", "CAT", "BIRD", "OTHER"]);

export const vehicles = pgTable("vehicles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  plateNumber: text("plate_number").notNull(),
  model: text("model").notNull(), // e.g., "White Ford Focus"
  verified: boolean("verified").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const pets = pgTable("pets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  type: petTypeEnum("type").notNull(),
  name: text("name").notNull(),
  description: text("description"), // Breed, color etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const emergencyContacts = pgTable("emergency_contacts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  phoneNumber: text("phone_number").notNull(),
  relation: text("relation").notNull(), // e.g., "Spouse", "Parent"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Type Exports
export type Vehicle = typeof vehicles.$inferSelect;
export type NewVehicle = typeof vehicles.$inferInsert;

export type Pet = typeof pets.$inferSelect;
export type NewPet = typeof pets.$inferInsert;

export type EmergencyContact = typeof emergencyContacts.$inferSelect;
export type NewEmergencyContact = typeof emergencyContacts.$inferInsert;
