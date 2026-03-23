import { pgTable, text, serial, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const waitlistRoleEnum = pgEnum("waitlist_role", ["parent", "school", "church"]);

export const waitlistTable = pgTable("waitlist", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  name: text("name"),
  role: waitlistRoleEnum("role").notNull().default("parent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertWaitlistSchema = createInsertSchema(waitlistTable).omit({ id: true, createdAt: true });
export type InsertWaitlist = z.infer<typeof insertWaitlistSchema>;
export type Waitlist = typeof waitlistTable.$inferSelect;
