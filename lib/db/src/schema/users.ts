import { pgTable, text, serial, integer, boolean, timestamp, pgEnum, index, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const userRoleEnum = pgEnum("user_role", ["parent", "child"]);

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  firebaseUid: text("firebase_uid").unique(),
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
  isAdmin: boolean("is_admin").default(false),
  screenTimeLimitMinutes: integer("screen_time_limit_minutes").default(0),
  dailyMessageLimit: integer("daily_message_limit").default(0),
  cooldownSeconds: integer("cooldown_seconds").default(0),
  subscriptionTier: text("subscription_tier"),
  resetToken: text("reset_token"),
  resetTokenExpires: timestamp("reset_token_expires"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_users_parent_id").on(table.parentId),
  index("idx_users_email").on(table.email),
  index("idx_users_role").on(table.role),
  index("idx_users_password_hash").on(table.passwordHash),
]);

export const insertUserSchema = createInsertSchema(usersTable).omit({ id: true, createdAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;
