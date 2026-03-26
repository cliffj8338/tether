import { pgTable, text, serial, integer, boolean, timestamp, pgEnum, real, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const eventSourceEnum = pgEnum("event_source", ["app", "web", "api"]);

export const topicCategoryEnum = pgEnum("topic_category", [
  "social", "emotional", "academic", "faith", "conflict",
  "humor", "family", "friendship", "identity", "health",
  "media", "creative", "sports", "technology", "other"
]);

export const sentimentLabelEnum = pgEnum("sentiment_label", [
  "very_negative", "negative", "neutral", "positive", "very_positive"
]);

export const emotionalToneEnum = pgEnum("emotional_tone", [
  "joy", "sadness", "anger", "fear", "surprise", "disgust",
  "trust", "anticipation", "curiosity", "empathy", "anxiety",
  "pride", "shame", "gratitude", "loneliness", "neutral"
]);

export const analyticsEventsTable = pgTable("analytics_events", {
  id: serial("id").primaryKey(),
  source: eventSourceEnum("source").notNull(),
  eventName: text("event_name").notNull(),
  sessionId: text("session_id"),
  userId: integer("user_id"),
  metadata: jsonb("metadata"),
  pageUrl: text("page_url"),
  referrer: text("referrer"),
  userAgent: text("user_agent"),
  ipHash: text("ip_hash"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_events_name").on(table.eventName),
  index("idx_events_created").on(table.createdAt),
  index("idx_events_source").on(table.source),
  index("idx_events_session").on(table.sessionId),
]);

export const sessionTrackingTable = pgTable("session_tracking", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  source: eventSourceEnum("source").notNull(),
  userId: integer("user_id"),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  endedAt: timestamp("ended_at"),
  durationSeconds: integer("duration_seconds"),
  pagesViewed: integer("pages_viewed").default(0),
  eventsCount: integer("events_count").default(0),
  deviceType: text("device_type"),
  platform: text("platform"),
  screenResolution: text("screen_resolution"),
  appVersion: text("app_version"),
}, (table) => [
  index("idx_sessions_started").on(table.startedAt),
  index("idx_sessions_user").on(table.userId),
]);

export const messageAnalyticsTable = pgTable("message_analytics", {
  id: serial("id").primaryKey(),
  messageId: integer("message_id").notNull(),
  conversationId: integer("conversation_id").notNull(),
  senderId: integer("sender_id").notNull(),
  senderAgeGroup: text("sender_age_group"),
  wordCount: integer("word_count").notNull(),
  sentenceCount: integer("sentence_count").notNull(),
  avgWordLength: real("avg_word_length"),
  vocabularyComplexity: real("vocabulary_complexity"),
  sentimentScore: real("sentiment_score"),
  sentimentLabel: sentimentLabelEnum("sentiment_label"),
  emotionalTone: emotionalToneEnum("emotional_tone"),
  topicCategory: topicCategoryEnum("topic_category"),
  topicKeywords: jsonb("topic_keywords"),
  hasEmoji: boolean("has_emoji").default(false),
  hasSlang: boolean("has_slang").default(false),
  responseTimeSeconds: integer("response_time_seconds"),
  isConversationStarter: boolean("is_conversation_starter").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_msg_analytics_convo").on(table.conversationId),
  index("idx_msg_analytics_sender").on(table.senderId),
  index("idx_msg_analytics_topic").on(table.topicCategory),
  index("idx_msg_analytics_created").on(table.createdAt),
]);

export const conversationInsightsTable = pgTable("conversation_insights", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull(),
  analyzedAt: timestamp("analyzed_at").defaultNow().notNull(),
  totalMessages: integer("total_messages").default(0),
  avgSentimentScore: real("avg_sentiment_score"),
  sentimentTrend: text("sentiment_trend"),
  dominantTopic: topicCategoryEnum("dominant_topic"),
  topicDistribution: jsonb("topic_distribution"),
  avgResponseTimeSeconds: real("avg_response_time_seconds"),
  avgWordCount: real("avg_word_count"),
  vocabularyDiversity: real("vocabulary_diversity"),
  emotionalRange: jsonb("emotional_range"),
  communicationBalance: real("communication_balance"),
  conversationDepth: real("conversation_depth"),
  healthScore: real("health_score"),
}, (table) => [
  index("idx_convo_insights_convo").on(table.conversationId),
  index("idx_convo_insights_analyzed").on(table.analyzedAt),
]);

export const keywordTrendsTable = pgTable("keyword_trends", {
  id: serial("id").primaryKey(),
  keyword: text("keyword").notNull(),
  category: topicCategoryEnum("category"),
  occurrenceCount: integer("occurrence_count").default(1),
  ageGroup: text("age_group"),
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_keyword_trends_keyword").on(table.keyword),
  index("idx_keyword_trends_period").on(table.periodStart),
  index("idx_keyword_trends_category").on(table.category),
]);

export const safetyAnalyticsTable = pgTable("safety_analytics", {
  id: serial("id").primaryKey(),
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  totalMessages: integer("total_messages").default(0),
  totalFlagged: integer("total_flagged").default(0),
  level1Count: integer("level1_count").default(0),
  level2Count: integer("level2_count").default(0),
  level3Count: integer("level3_count").default(0),
  level4Count: integer("level4_count").default(0),
  level5Count: integer("level5_count").default(0),
  blockedCount: integer("blocked_count").default(0),
  avgResponseTimeMinutes: real("avg_response_time_minutes"),
  falsePositiveRate: real("false_positive_rate"),
  topFlagCategories: jsonb("top_flag_categories"),
  faithModeFlags: integer("faith_mode_flags").default(0),
  ageGroupBreakdown: jsonb("age_group_breakdown"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_safety_period").on(table.periodStart),
]);

export const demographicSnapshotsTable = pgTable("demographic_snapshots", {
  id: serial("id").primaryKey(),
  snapshotDate: timestamp("snapshot_date").notNull(),
  totalFamilies: integer("total_families").default(0),
  totalParents: integer("total_parents").default(0),
  totalChildren: integer("total_children").default(0),
  ageDistribution: jsonb("age_distribution"),
  gradeDistribution: jsonb("grade_distribution"),
  faithModeAdoption: real("faith_mode_adoption"),
  avgChildrenPerFamily: real("avg_children_per_family"),
  trustLevelDistribution: jsonb("trust_level_distribution"),
  activeUsersLast7d: integer("active_users_last_7d").default(0),
  activeUsersLast30d: integer("active_users_last_30d").default(0),
  newSignupsLast7d: integer("new_signups_last_7d").default(0),
  retentionRate7d: real("retention_rate_7d"),
  retentionRate30d: real("retention_rate_30d"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_demo_snapshot_date").on(table.snapshotDate),
]);

export const insertAnalyticsEventSchema = createInsertSchema(analyticsEventsTable).omit({ id: true, createdAt: true });
export const insertSessionTrackingSchema = createInsertSchema(sessionTrackingTable).omit({ id: true });
export const insertMessageAnalyticsSchema = createInsertSchema(messageAnalyticsTable).omit({ id: true, createdAt: true });
export const insertConversationInsightSchema = createInsertSchema(conversationInsightsTable).omit({ id: true });
export const insertKeywordTrendSchema = createInsertSchema(keywordTrendsTable).omit({ id: true, createdAt: true });
export const insertSafetyAnalyticsSchema = createInsertSchema(safetyAnalyticsTable).omit({ id: true, createdAt: true });
export const insertDemographicSnapshotSchema = createInsertSchema(demographicSnapshotsTable).omit({ id: true, createdAt: true });

export type AnalyticsEvent = typeof analyticsEventsTable.$inferSelect;
export type SessionTracking = typeof sessionTrackingTable.$inferSelect;
export type MessageAnalytics = typeof messageAnalyticsTable.$inferSelect;
export type ConversationInsight = typeof conversationInsightsTable.$inferSelect;
export type KeywordTrend = typeof keywordTrendsTable.$inferSelect;
export type SafetyAnalytics = typeof safetyAnalyticsTable.$inferSelect;
export type DemographicSnapshot = typeof demographicSnapshotsTable.$inferSelect;
