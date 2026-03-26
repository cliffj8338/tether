import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { anthropic } from "@workspace/integrations-anthropic-ai";
import { db } from "@workspace/db";
import { sql } from "drizzle-orm";
import { getUserFromToken } from "../lib/auth";

const router: IRouter = Router();

async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const adminKey = req.headers["x-admin-key"];
  if (adminKey === (process.env.ADMIN_API_KEY || "tether-admin-dev")) {
    next();
    return;
  }
  const user = await getUserFromToken(req);
  if (!user || user.role !== "parent") {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

router.use("/admin/analytics", requireAdmin);

const SCHEMA_CONTEXT = `You are a research analytics AI for Tether, a supervised kids messaging app. You have access to a PostgreSQL database with these tables:

TABLES:
1. users (id, username, email, role ['parent'|'child'], age, grade, trust_level [1-5], faith_mode_enabled, is_paused, parent_id, created_at)
2. messages (id, conversation_id, sender_id, content, is_flagged, is_blocked, alert_level, created_at)
3. conversations (id, parent_id, child_id, contact_id, created_at)
4. contacts (id, parent_id, child_id, contact_name, is_approved, created_at)
5. alerts (id, parent_id, child_id, message_id, alert_level, alert_type, description, is_read, created_at)
6. analytics_events (id, source ['app'|'web'|'api'], event_name, session_id, user_id, metadata JSONB, page_url, referrer, user_agent, ip_hash, created_at)
7. session_tracking (id, session_id, source, user_id, started_at, ended_at, duration_seconds, pages_viewed, events_count, device_type, platform)
8. message_analytics (id, message_id, conversation_id, sender_id, sender_age_group, word_count, sentence_count, avg_word_length, vocabulary_complexity, sentiment_score [-1 to 1], sentiment_label, emotional_tone, topic_category, topic_keywords JSONB, has_emoji, has_slang, emoji_to_text_ratio, message_length, interest_nouns JSONB, interest_verbs JSONB, interaction_depth, response_time_seconds, is_conversation_starter, created_at)
9. behavioral_metrics (id, user_id, period_date, sentiment_volatility, sentiment_mean, sentiment_min, sentiment_max, avg_response_latency_seconds, response_latency_stddev, emoji_to_text_ratio, emoji_to_text_ratio_trend, avg_message_length, message_length_trend, cognitive_fatigue_score, messages_analyzed, anxiety_indicator_score, social_avoidance_score, created_at)
10. network_graph (id, user_id, period_date, influence_score, reply_trigger_rate, downstream_actions, unique_connections, messages_sent, messages_received, initiation_rate, reciprocity_score, network_role, cluster_membership, created_at)
11. churn_predictions (id, user_id, computed_at, churn_risk_score, predicted_churn_date, confidence_level, silence_gradient, message_length_gradient, response_time_gradient, session_frequency_gradient, days_inactive, last_active_at, risk_factors JSONB)
12. temporal_anomalies (id, detected_at, anomaly_type, severity, metric_name, baseline_value, observed_value, percent_change, time_window_minutes, affected_users, metadata JSONB, resolved)
13. interest_graph (id, age_group, period_date, interest_cluster, nouns JSONB, verbs JSONB, occurrence_count, sentiment_affinity, created_at)
14. conversation_insights (id, conversation_id, analyzed_at, total_messages, avg_sentiment_score, sentiment_trend, dominant_topic, topic_distribution JSONB, avg_response_time_seconds, avg_word_count, vocabulary_diversity, emotional_range JSONB, communication_balance, conversation_depth, health_score)
15. keyword_trends (id, keyword, category, occurrence_count, age_group, period_start, period_end, created_at)
16. safety_analytics (id, period_start, period_end, total_messages, total_flagged, level1_count-level5_count, blocked_count, avg_response_time_minutes, false_positive_rate, top_flag_categories JSONB, faith_mode_flags, age_group_breakdown JSONB, created_at)
17. demographic_snapshots (id, snapshot_date, total_families, total_parents, total_children, age_distribution JSONB, grade_distribution JSONB, faith_mode_adoption, avg_children_per_family, trust_level_distribution JSONB, active_users_last_7d, active_users_last_30d, new_signups_last_7d, retention_rate_7d, retention_rate_30d, created_at)
18. waitlist (id, email, name, role ['parent'|'school'|'church'], created_at)

ENUMS:
- event_source: 'app', 'web', 'api'
- topic_category: 'social', 'emotional', 'academic', 'faith', 'conflict', 'humor', 'family', 'friendship', 'identity', 'health', 'media', 'creative', 'sports', 'technology', 'other'
- sentiment_label: 'very_negative', 'negative', 'neutral', 'positive', 'very_positive'
- emotional_tone: 'joy', 'sadness', 'anger', 'fear', 'surprise', 'disgust', 'trust', 'anticipation', 'curiosity', 'empathy', 'anxiety', 'pride', 'shame', 'gratitude', 'loneliness', 'neutral'

RULES:
1. Generate ONLY SELECT queries — never INSERT, UPDATE, DELETE, DROP, ALTER, or any DDL/DML that modifies data.
2. Always anonymize results — never return raw message content, emails, or identifying information. Use aggregates, counts, averages, and distributions.
3. Limit results to 100 rows max.
4. Use clear column aliases for readability.
5. Think about what data points answer the research question most effectively.

Respond with a JSON object:
{
  "thinking": "<brief explanation of your analytical approach>",
  "sql": "<the SELECT query>",
  "chartType": "<bar|line|pie|table|number|none>",
  "chartConfig": { "xKey": "<column>", "yKey": "<column>", "label": "<chart title>" },
  "summary": "<brief natural language summary of what the query will show>"
}`;

router.post("/admin/analytics/query", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || typeof question !== "string") {
      res.status(400).json({ error: "question is required" });
      return;
    }

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 1024,
      system: SCHEMA_CONTEXT,
      messages: [{ role: "user", content: question }],
    });

    let text = response.content[0].type === "text" ? response.content[0].text : "";
    text = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      res.json({
        thinking: "I could not generate a structured query for this question.",
        data: [],
        chartType: "none",
        summary: text,
      });
      return;
    }

    const querySql = parsed.sql?.trim() ?? "";

    const forbidden = /\b(INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|TRUNCATE|GRANT|REVOKE|EXECUTE|COPY|pg_|SET\s+ROLE|INTO\s+OUTFILE|LOAD\s+DATA)\b/i;
    if (forbidden.test(querySql)) {
      res.status(400).json({ error: "Only SELECT queries are allowed" });
      return;
    }

    const normalizedSql = querySql.replace(/\/\*[\s\S]*?\*\//g, "").replace(/--.*$/gm, "").trim();
    if (!normalizedSql.toUpperCase().startsWith("SELECT")) {
      res.status(400).json({ error: "Query must be a SELECT statement" });
      return;
    }

    const piiColumns = /\b(email|password|content|ip_hash)\b/i;
    if (piiColumns.test(normalizedSql)) {
      res.status(400).json({ error: "Query must not access PII columns (email, password, content, ip_hash)" });
      return;
    }

    const safeSql = normalizedSql.replace(/;\s*$/, "").replace(/\bLIMIT\s+\d+/i, "") + " LIMIT 100";

    let data: unknown[] = [];
    try {
      const result = await db.execute(sql.raw(safeSql));
      data = Array.isArray(result) ? result : (result as any).rows ?? [];
    } catch (dbError: any) {
      res.json({
        thinking: parsed.thinking,
        data: [],
        chartType: "none",
        summary: `Query error: ${dbError.message}. ${parsed.summary}`,
        sql: safeSql,
        error: dbError.message,
      });
      return;
    }

    res.json({
      thinking: parsed.thinking,
      data,
      chartType: parsed.chartType ?? "table",
      chartConfig: parsed.chartConfig ?? {},
      summary: parsed.summary,
      sql: safeSql,
      rowCount: data.length,
    });
  } catch (error) {
    req.log.error(error, "Failed to process AI query");
    res.status(500).json({ error: "Failed to process query" });
  }
});

export default router;
