import { relations } from "drizzle-orm";
import { pgEnum, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { facilities } from "./facilities";
import { facilitySessions } from "./facility_sessions";
import { users } from "./users";

// Bekleme listesi durumları
export const waitlistStatusEnum = pgEnum("waitlist_status", [
  "pending",      // Sırada bekliyor
  "notified",     // Yer açıldı, bildirim gitti
  "converted",    // Rezervasyona dönüştü
  "expired",      // Bildirim süresi doldu (yer başkasına geçti)
  "cancelled",    // Kullanıcı sıradan çıktı
]);

export const facilityWaitlist = pgTable("facility_waitlist", {
  id: uuid("id").defaultRandom().primaryKey(),
  facilityId: uuid("facility_id")
    .notNull()
    .references(() => facilities.id, { onDelete: "cascade" }),
  sessionId: uuid("session_id")
    .references(() => facilitySessions.id, { onDelete: "cascade" }), // Opsiyonel: Seanssız tesislerde sadece tarih olabilir
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  date: timestamp("date", { mode: "date" }).notNull(), // Hangi gün için sırada?
  status: waitlistStatusEnum("status").default("pending").notNull(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(), // FIFO sırası için kritik
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  notifiedAt: timestamp("notified_at"), // Bildirim ne zaman gitti?
});

export const facilityWaitlistRelations = relations(facilityWaitlist, ({ one }) => ({
  facility: one(facilities, {
    fields: [facilityWaitlist.facilityId],
    references: [facilities.id],
  }),
  session: one(facilitySessions, {
    fields: [facilityWaitlist.sessionId],
    references: [facilitySessions.id],
  }),
  user: one(users, {
    fields: [facilityWaitlist.userId],
    references: [users.id],
  }),
}));
