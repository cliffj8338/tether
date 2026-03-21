import { pgTable, text, serial, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const alertLevelEnum = pgEnum("alert_level", ["none", "level1", "level2", "level3", "level4", "level5"]);

export const contactsTable = pgTable("contacts", {
  id: serial("id").primaryKey(),
  childId: integer("child_id").notNull(),
  contactChildId: integer("contact_child_id").notNull(),
  contactName: text("contact_name").notNull(),
  avatarColor: text("avatar_color").default("#7B8EC4").notNull(),
  approvedByParent: boolean("approved_by_parent").default(false),
  parentIntroSent: boolean("parent_intro_sent").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const conversationsTable = pgTable("conversations", {
  id: serial("id").primaryKey(),
  childId: integer("child_id").notNull(),
  contactId: integer("contact_id").notNull(),
  lastMessagePreview: text("last_message_preview"),
  lastMessageAt: timestamp("last_message_at"),
  unreadCount: integer("unread_count").default(0),
  isPaused: boolean("is_paused").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messagesTable = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull(),
  senderId: integer("sender_id").notNull(),
  content: text("content").notNull(),
  alertLevel: alertLevelEnum("alert_level").default("none"),
  flagReason: text("flag_reason"),
  isBlocked: boolean("is_blocked").default(false),
  isDelivered: boolean("is_delivered").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const alertsTable = pgTable("alerts", {
  id: serial("id").primaryKey(),
  parentId: integer("parent_id").notNull(),
  childId: integer("child_id").notNull(),
  messageId: integer("message_id"),
  alertLevel: alertLevelEnum("alert_level").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertContactSchema = createInsertSchema(contactsTable).omit({ id: true, createdAt: true });
export const insertConversationSchema = createInsertSchema(conversationsTable).omit({ id: true, createdAt: true });
export const insertMessageSchema = createInsertSchema(messagesTable).omit({ id: true, createdAt: true });
export const insertAlertSchema = createInsertSchema(alertsTable).omit({ id: true, createdAt: true });

export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contactsTable.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversationsTable.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messagesTable.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type Alert = typeof alertsTable.$inferSelect;
