import { pgTable, text, serial, integer, timestamp, numeric } from "drizzle-orm/pg-core";

export const platformCostsTable = pgTable("platform_costs", {
  id: serial("id").primaryKey(),
  month: text("month").notNull(),
  category: text("category").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type PlatformCost = typeof platformCostsTable.$inferSelect;
