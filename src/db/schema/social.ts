import { numeric, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { apartments } from "./apartments";
import { users } from "./users";

export const marketItemTypeEnum = pgEnum("market_item_type", ["sale", "rent", "giveaway", "borrow"]);
export const marketItemStatusEnum = pgEnum("market_item_status", ["available", "sold", "hidden"]);

export const announcements = pgTable("announcements", {
  id: uuid("id").primaryKey().defaultRandom(),
  apartmentId: uuid("apartment_id")
    .references(() => apartments.id)
    .notNull(),
  authorId: uuid("author_id")
    .references(() => users.id)
    .notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const marketplaceItems = pgTable("marketplace_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  sellerId: uuid("seller_id")
    .references(() => users.id)
    .notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: numeric("price"),
  type: marketItemTypeEnum("type").notNull(),
  status: marketItemStatusEnum("status").notNull().default("available"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Announcement = typeof announcements.$inferSelect;
export type MarketplaceItem = typeof marketplaceItems.$inferSelect;
