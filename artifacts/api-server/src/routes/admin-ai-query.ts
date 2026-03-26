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

const SCHEMA_CONTEXT = `You are a research analytics AI for Tether, a supervised kids messaging app with 18 database tables tracking 200+ data points. You support 3 research lenses: Child Psychology, Marketing, and Data Science.

TABLES (18 total):

--- CORE ENTITIES ---
1. users (id SERIAL PK, display_name TEXT, email TEXT, role ENUM['parent','child'], age INT, grade TEXT, trust_level INT[1-5], faith_mode_enabled BOOL, is_paused BOOL, parent_id INT FK→users, push_token TEXT, phone TEXT, family_code TEXT UNIQUE, avatar_color TEXT, created_at TIMESTAMP)
2. contacts (id, child_id INT FK→users, contact_child_id INT FK→users, contact_name TEXT, avatar_color TEXT, approved_by_parent BOOL, parent_intro_sent BOOL, created_at)
3. conversations (id, child_id INT FK→users, contact_id INT FK→contacts, last_message_preview TEXT, last_message_at TIMESTAMP, unread_count INT, is_paused BOOL, created_at)
4. messages (id, conversation_id INT FK→conversations, sender_id INT FK→users, content TEXT, alert_level ENUM['none','level1'-'level5'], flag_reason TEXT, is_blocked BOOL, is_delivered BOOL, created_at)
5. alerts (id, parent_id INT FK→users, child_id INT FK→users, message_id INT FK→messages, alert_level ENUM, title TEXT, description TEXT, is_read BOOL, created_at)
6. waitlist (id, email TEXT UNIQUE, name TEXT, role ENUM['parent','school','church'], created_at)

--- NLP INTELLIGENCE (per-message AI analysis by Claude) ---
7. message_analytics (id, message_id FK, conversation_id FK, sender_id FK, sender_age_group TEXT, word_count INT, sentence_count INT, avg_word_length REAL, vocabulary_complexity REAL[0-1], sentiment_score REAL[-1 to 1], sentiment_label ENUM, emotional_tone ENUM(16 types), topic_category ENUM(15 types), topic_keywords JSONB[], has_emoji BOOL, has_slang BOOL, emoji_to_text_ratio REAL, message_length INT, interest_nouns JSONB[], interest_verbs JSONB[], interaction_depth INT, response_time_seconds INT, is_conversation_starter BOOL, created_at)

--- CONVERSATION-LEVEL INSIGHTS ---
8. conversation_insights (id, conversation_id FK, analyzed_at, total_messages INT, avg_sentiment_score REAL, sentiment_trend TEXT['improving','stable','declining'], dominant_topic ENUM, topic_distribution JSONB, avg_response_time_seconds REAL, avg_word_count REAL, vocabulary_diversity REAL, emotional_range JSONB, communication_balance REAL[0-1], conversation_depth REAL, health_score REAL[0-1])

--- BEHAVIORAL INTELLIGENCE (daily per-user, computed) ---
9. behavioral_metrics (id, user_id FK, period_date TIMESTAMP, sentiment_volatility REAL, sentiment_mean REAL, sentiment_min REAL, sentiment_max REAL, avg_response_latency_seconds REAL, response_latency_stddev REAL, emoji_to_text_ratio REAL, emoji_to_text_ratio_trend REAL, avg_message_length REAL, message_length_trend REAL, cognitive_fatigue_score REAL[0-1], messages_analyzed INT, anxiety_indicator_score REAL[0-1], social_avoidance_score REAL[0-1], created_at)

--- SOCIAL NETWORK ANALYSIS (per-user, computed) ---
10. network_graph (id, user_id FK, period_date TIMESTAMP, influence_score REAL[0-1], reply_trigger_rate REAL[0-1], downstream_actions INT, unique_connections INT, messages_sent INT, messages_received INT, initiation_rate REAL[0-1], reciprocity_score REAL[0-1], network_role TEXT['leader','initiator','influencer','observer','participant'], cluster_membership TEXT, created_at)

--- PREDICTIVE MODELS (per-user, computed) ---
11. churn_predictions (id, user_id FK, computed_at TIMESTAMP, churn_risk_score REAL[0-1], predicted_churn_date TIMESTAMP, confidence_level REAL[0-1], silence_gradient REAL, message_length_gradient REAL, response_time_gradient REAL, session_frequency_gradient REAL, days_inactive INT, last_active_at TIMESTAMP, risk_factors JSONB[])

--- ANOMALY DETECTION ---
12. temporal_anomalies (id, detected_at TIMESTAMP, anomaly_type TEXT, severity REAL, metric_name TEXT, baseline_value REAL, observed_value REAL, percent_change REAL, time_window_minutes INT, affected_users INT, metadata JSONB, resolved BOOL)

--- INTEREST INTELLIGENCE (by age group, computed) ---
13. interest_graph (id, age_group TEXT, period_date TIMESTAMP, interest_cluster TEXT, nouns JSONB[], verbs JSONB[], occurrence_count INT, sentiment_affinity REAL, created_at)

--- CONTENT TRENDS ---
14. keyword_trends (id, keyword TEXT, category ENUM(topic_category), occurrence_count INT, age_group TEXT, period_start TIMESTAMP, period_end TIMESTAMP, created_at)

--- SAFETY & MODERATION SNAPSHOTS ---
15. safety_analytics (id, period_start, period_end, total_messages INT, total_flagged INT, level1_count-level5_count INT, blocked_count INT, avg_response_time_minutes REAL, false_positive_rate REAL, top_flag_categories JSONB, faith_mode_flags INT, age_group_breakdown JSONB, created_at)

--- PLATFORM GROWTH ---
16. demographic_snapshots (id, snapshot_date, total_families INT, total_parents INT, total_children INT, age_distribution JSONB, grade_distribution JSONB, faith_mode_adoption REAL, avg_children_per_family REAL, trust_level_distribution JSONB, active_users_last_7d INT, active_users_last_30d INT, new_signups_last_7d INT, retention_rate_7d REAL, retention_rate_30d REAL, created_at)

--- RAW EVENT STREAM ---
17. analytics_events (id, source ENUM['app','web','api'], event_name TEXT, session_id TEXT, user_id INT, metadata JSONB, page_url TEXT, referrer TEXT, user_agent TEXT, ip_hash TEXT, created_at)

--- SESSION INTELLIGENCE ---
18. session_tracking (id, session_id TEXT UNIQUE, source ENUM, user_id INT, started_at, ended_at, duration_seconds INT, pages_viewed INT, events_count INT, device_type TEXT, platform TEXT, screen_resolution TEXT, app_version TEXT)

ENUMS:
- event_source: 'app', 'web', 'api'
- user_role: 'parent', 'child'
- alert_level: 'none', 'level1', 'level2', 'level3', 'level4', 'level5'
- topic_category: 'social', 'emotional', 'academic', 'faith', 'conflict', 'humor', 'family', 'friendship', 'identity', 'health', 'media', 'creative', 'sports', 'technology', 'other'
- sentiment_label: 'very_negative', 'negative', 'neutral', 'positive', 'very_positive'
- emotional_tone: 'joy', 'sadness', 'anger', 'fear', 'surprise', 'disgust', 'trust', 'anticipation', 'curiosity', 'empathy', 'anxiety', 'pride', 'shame', 'gratitude', 'loneliness', 'neutral'
- waitlist_role: 'parent', 'school', 'church'

KEY JOIN PATTERNS:
- users.id → message_analytics.sender_id (demographics ↔ NLP)
- users.id → behavioral_metrics.user_id (demographics ↔ behavior)
- users.id → network_graph.user_id (demographics ↔ social position)
- users.id → churn_predictions.user_id (demographics ↔ churn risk)
- users.id → messages.sender_id (demographics ↔ raw messages)
- users.id → alerts.child_id (demographics ↔ safety events)
- users.id → session_tracking.user_id (demographics ↔ engagement)
- users.parent_id → users.id (child ↔ parent, family grouping)
- messages.id → message_analytics.message_id (raw message ↔ NLP features)
- messages.conversation_id → conversations.id (messages ↔ conversation)
- conversations.id → conversation_insights.conversation_id (conversation ↔ health)
- message_analytics.sender_id → behavioral_metrics.user_id (per-message ↔ daily aggregates)
- behavioral_metrics.user_id → churn_predictions.user_id (behavior ↔ churn risk)
- network_graph.user_id → behavioral_metrics.user_id (social position ↔ behavior)
- network_graph.user_id → churn_predictions.user_id (social role ↔ churn risk)

CORRELATION CAPABILITIES:
You can correlate ANY fields across ANY tables. Common cross-table analyses include:
- Age/grade ↔ sentiment, vocabulary, topics, interests, emoji usage
- Trust level ↔ alert frequency, blocked rates, faith mode correlation
- Network role ↔ churn risk, anxiety score, influence on peers
- Time-of-day ↔ sentiment, topic category, response times
- Session duration ↔ sentiment trends, message volume
- Interest clusters ↔ age groups, sentiment affinity, topic categories
- Churn signals ↔ behavioral metrics, network position, session patterns
- Faith mode ↔ alert rates, topic distribution, safety outcomes
- Vocabulary complexity ↔ age, conversation depth, sentiment
Use CORR(), regression, percentile, window functions, CTEs for sophisticated analysis.

RULES:
1. Generate ONLY SELECT queries — never INSERT, UPDATE, DELETE, DROP, ALTER, or any DDL/DML.
2. ANONYMIZE: never return raw message content, emails, phone numbers, or PII. Use aggregates, counts, averages, and distributions. Reference users by anonymized IDs only.
3. Use clear, descriptive column aliases.
4. For correlations: use CORR(x, y), AVG(x) GROUP BY category, or CTE-based analysis.
5. For trends: use DATE_TRUNC, window functions (LAG, LEAD, AVG OVER).
6. For distributions: use COUNT(*) GROUP BY with percentage calculations.
7. Pick the most effective chart type: bar (comparisons), line (trends), pie (distributions), table (detailed breakdowns), number (single KPIs).

Respond with a JSON object:
{
  "thinking": "<your analytical reasoning — which tables to join, what metrics matter, what the correlation reveals>",
  "sql": "<the SELECT query>",
  "chartType": "<bar|line|pie|table|number|none>",
  "chartConfig": { "xKey": "<column>", "yKey": "<column>", "label": "<chart title>" },
  "summary": "<natural language summary of what the results mean for the researcher>"
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
