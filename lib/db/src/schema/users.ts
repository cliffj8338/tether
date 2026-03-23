import { pgTable, text, serial, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const userRoleEnum = pgEnum("user_role", ["parent", "child"]);

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email"),
  displayName: text("display_name").notNull(),
  role: userRoleEnum("role").notNull(),
  parentId: integer("parent_id"),
  pin: text("pin"),
  avatarColor: text("avatar_color").default("#6B9E8A"),
  grade: text("grade"),
  age: integer("age"),
  trustLevel: integer("trust_level").default(1),
  faithModeEnabled: boolean("faith_mode_enabled").default(false),
  isPaused: boolean("is_paused").default(false),
  pushToken: text("push_token"),
  phone: text("phone"),
  passwordHash: text("password_hash"),
  familyCode: text("family_code").unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({ id: true, createdAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;
