import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  phoneNumber: text("phone_number").unique(),
  fullName: text("full_name").notNull(),
  password: text("password").notNull(),
  avatarUrl: text("avatar_url"),
  role: text("role", { enum: ["super_admin", "admin", "resident", "security"] })
    .notNull()
    .default("resident"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
