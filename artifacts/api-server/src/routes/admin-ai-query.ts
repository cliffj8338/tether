import { Router, type IRouter } from "express";
import { anthropic } from "@workspace/integrations-anthropic-ai";
import { db } from "@workspace/db";
import { sql } from "drizzle-orm";
import { requireAdmin } from "../lib/require-admin";

const router: IRouter = Router();

router.use("/admin/analytics", requireAdmin);

const SCHEMA_CONTEXT = `You are a SQL expert for Tether, a supervised kids messaging app. Generate PostgreSQL SELECT queries for the following schema.

TABLES:
1. users (id SERIAL PK, display_name TEXT, email TEXT, role TEXT 'parent'|'child', age INT, grade TEXT, trust_level INT 1-5, faith_mode_enabled BOOL, is_paused BOOL, parent_id INT FK→users, family_code TEXT, avatar_color TEXT, created_at TIMESTAMP)
2. contacts (id, child_id FK→users, contact_child_id FK→users, contact_name TEXT, avatar_color TEXT, approved_by_parent BOOL, created_at)
3. conversations (id, child_id FK→users, contact_id FK→contacts, last_message_preview TEXT, last_message_at TIMESTAMP, unread_count INT, is_paused BOOL, created_at)
4. messages (id, conversation_id FK→conversations, sender_id FK→users, content TEXT, alert_level TEXT 'none'|'level1'-'level5', flag_reason TEXT, is_blocked BOOL, is_delivered BOOL, created_at)
5. alerts (id, parent_id FK→users, child_id FK→users, message_id FK→messages, alert_level TEXT, title TEXT, description TEXT, is_read BOOL, created_at)
6. waitlist (id, email TEXT, name TEXT, role TEXT 'parent'|'school'|'church', created_at)
7. message_analytics (id, message_id FK, conversation_id FK, sender_id FK, sender_age_group TEXT '6-8'|'9-11'|'12-14'|'15+', word_count INT, sentence_count INT, avg_word_length REAL, vocabulary_complexity REAL 0-1, sentiment_score REAL -1 to 1, sentiment_label TEXT, emotional_tone TEXT, topic_category TEXT, topic_keywords JSONB, has_emoji BOOL, has_slang BOOL, emoji_to_text_ratio REAL, message_length INT, interaction_depth INT, response_time_seconds INT, is_conversation_starter BOOL, created_at)
8. conversation_insights (id, conversation_id FK, analyzed_at, total_messages INT, avg_sentiment_score REAL, sentiment_trend TEXT, dominant_topic TEXT, topic_distribution JSONB, avg_response_time_seconds REAL, avg_word_count REAL, vocabulary_diversity REAL, communication_balance REAL, conversation_depth REAL, health_score REAL 0-1)
9. behavioral_metrics (id, user_id FK, period_date TIMESTAMP, sentiment_volatility REAL, sentiment_mean REAL, avg_response_latency_seconds REAL, avg_message_length REAL, cognitive_fatigue_score REAL, messages_analyzed INT, anxiety_indicator_score REAL, social_avoidance_score REAL)
10. network_graph (id, user_id FK, period_date TIMESTAMP, influence_score REAL, reply_trigger_rate REAL, unique_connections INT, messages_sent INT, messages_received INT, initiation_rate REAL, reciprocity_score REAL, network_role TEXT, cluster_membership TEXT)
11. churn_predictions (id, user_id FK, churn_risk_score REAL, predicted_churn_date TIMESTAMP, confidence_level REAL, days_inactive INT, last_active_at TIMESTAMP, risk_factors JSONB)
12. temporal_anomalies (id, detected_at TIMESTAMP, anomaly_type TEXT, severity REAL, metric_name TEXT, baseline_value REAL, observed_value REAL, percent_change REAL, affected_users INT, resolved BOOL)
13. interest_graph (id, age_group TEXT, period_date TIMESTAMP, interest_cluster TEXT, nouns JSONB, verbs JSONB, occurrence_count INT, sentiment_affinity REAL)
14. keyword_trends (id, keyword TEXT, category TEXT, occurrence_count INT, age_group TEXT, period_start TIMESTAMP, period_end TIMESTAMP)
15. safety_analytics (id, period_start, period_end, total_messages INT, total_flagged INT, level1_count-level5_count INT, blocked_count INT, avg_response_time_minutes REAL, false_positive_rate REAL, top_flag_categories JSONB, faith_mode_flags INT, age_group_breakdown JSONB)
16. demographic_snapshots (id, snapshot_date, total_families INT, total_parents INT, total_children INT, age_distribution JSONB, grade_distribution JSONB, faith_mode_adoption REAL, avg_children_per_family REAL, trust_level_distribution JSONB, active_users_last_7d INT, active_users_last_30d INT, new_signups_last_7d INT, retention_rate_7d REAL, retention_rate_30d REAL)
17. analytics_events (id, source TEXT 'app'|'web', event_name TEXT, session_id TEXT, user_id INT, page_url TEXT, referrer TEXT, created_at)
18. session_tracking (id, session_id TEXT, source TEXT, started_at, ended_at, duration_seconds INT, pages_viewed INT, events_count INT, device_type TEXT, platform TEXT)

IMPORTANT NOTES:
- topic_category values: 'social','emotional','academic','faith','conflict','humor','family','friendship','identity','health','media','creative','sports','technology','other'
- sentiment_label values: 'very_negative','negative','neutral','positive','very_positive'
- sender_age_group in message_analytics is TEXT: '6-8','9-11','12-14','15+'
- Age groups must be derived from users.age using CASE WHEN, or use message_analytics.sender_age_group directly
- For age-based analysis, prefer message_analytics.sender_age_group over joining with users
- Use CTEs (WITH clauses) freely — they are supported
- Always use clear column aliases
- Keep results under 25 rows for clean visualization — use GROUP BY, aggregation, LIMIT
- NEVER select raw message content, emails, or passwords
- ONLY generate SELECT queries

Return ONLY a JSON object (no markdown, no code fences):
{"sql": "<the query>", "chartType": "bar|line|pie|table|number", "chartConfig": {"xKey": "<x column>", "yKey": "<y column>", "label": "<chart title>"}}`;

const FORBIDDEN = /\b(INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|TRUNCATE|GRANT|REVOKE|EXECUTE|COPY|SET\s+ROLE)\b/i;
const PII_PATTERNS = [/\bpassword_hash\b/i, /\bmessages\.content\b/i, /SELECT\s[^]*?\bcontent\s*,/i, /SELECT\s+content\b/i];

function sanitizeSql(rawSql: string): string | null {
  const cleaned = rawSql.replace(/\/\*[\s\S]*?\*\//g, "").replace(/--.*$/gm, "").trim();
  if (FORBIDDEN.test(cleaned)) return null;
  const upper = cleaned.toUpperCase();
  if (!upper.startsWith("SELECT") && !upper.startsWith("WITH")) return null;
  if (PII_PATTERNS.some(p => p.test(cleaned))) return null;
  return cleaned.replace(/;\s*$/, "").replace(/\bLIMIT\s+\d+/gi, "") + " LIMIT 25";
}

async function executeQuery(querySql: string): Promise<{ data: unknown[]; error?: string }> {
  try {
    const result = await db.execute(sql.raw(querySql));
    const data = Array.isArray(result) ? result : (result as any).rows ?? [];
    return { data };
  } catch (err: any) {
    return { data: [], error: err.message };
  }
}

router.post("/admin/analytics/query", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || typeof question !== "string") {
      res.status(400).json({ error: "question is required" });
      return;
    }

    const messages: { role: "user" | "assistant"; content: string }[] = [
      { role: "user", content: question },
    ];

    let finalData: unknown[] = [];
    let finalSql = "";
    let chartType = "table";
    let chartConfig: Record<string, string> = {};
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      attempts++;

      const aiResponse = await anthropic.messages.create({
        model: "claude-haiku-4-5",
        max_tokens: 1500,
        system: SCHEMA_CONTEXT,
        messages,
      });

      let text = aiResponse.content[0].type === "text" ? aiResponse.content[0].text : "";
      text = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) text = jsonMatch[0];

      let parsed: any;
      try {
        parsed = JSON.parse(text);
      } catch {
        if (attempts < maxAttempts) {
          messages.push({ role: "assistant", content: text });
          messages.push({ role: "user", content: "Your response was not valid JSON. Please return ONLY a JSON object with keys: sql, chartType, chartConfig. No markdown, no explanation." });
          continue;
        }
        res.json({ data: [], chartType: "none", summary: "I wasn't able to analyze that question. Please try a simpler or more specific question.", rowCount: 0 });
        return;
      }

      const safeSql = sanitizeSql(parsed.sql ?? "");
      if (!safeSql) {
        if (attempts < maxAttempts) {
          messages.push({ role: "assistant", content: text });
          messages.push({ role: "user", content: "The SQL query was invalid or contained forbidden operations. Generate a new SELECT-only query. Use WITH/CTE if needed. Do NOT access content, email, or password columns." });
          continue;
        }
        res.json({ data: [], chartType: "none", summary: "I couldn't generate a safe query for that question. Try asking about aggregated metrics or trends.", rowCount: 0 });
        return;
      }

      const { data, error } = await executeQuery(safeSql);

      if (error) {
        if (attempts < maxAttempts) {
          messages.push({ role: "assistant", content: text });
          messages.push({ role: "user", content: `The query failed with error: "${error}". Please fix the SQL and try again. Common issues: wrong column names, missing table aliases, incorrect ENUM values. Return the corrected JSON.` });
          continue;
        }
        res.json({ data: [], chartType: "none", summary: `I tried ${maxAttempts} times but couldn't generate a working query. The database returned: ${error}`, rowCount: 0 });
        return;
      }

      finalData = data;
      finalSql = safeSql;
      chartType = parsed.chartType ?? "table";
      chartConfig = parsed.chartConfig ?? {};
      break;
    }

    if (finalData.length === 0) {
      res.json({
        data: [],
        chartType: "none",
        summary: "The query returned no results. The database may not have data matching your criteria, or try rephrasing your question.",
        sql: finalSql,
        rowCount: 0,
      });
      return;
    }

    const dataPreview = JSON.stringify(finalData.slice(0, 10));
    const columns = Object.keys(finalData[0] as any);

    const summaryResponse = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 500,
      system: "You are a research analyst for Tether, a supervised kids messaging platform. Write a clear, insightful 2-4 sentence summary of query results. Focus on what the data reveals — trends, standout values, implications for child safety or platform growth. Be specific with numbers. Do NOT mention SQL, queries, or technical details. Write as if briefing a non-technical executive.",
      messages: [
        { role: "user", content: `Question: "${question}"\n\nColumns: ${columns.join(", ")}\nRows: ${finalData.length}\nData preview: ${dataPreview}\n\nWrite a concise research summary.` },
      ],
    });

    const summary = summaryResponse.content[0].type === "text" ? summaryResponse.content[0].text : "Here are the results.";

    res.json({
      data: finalData,
      chartType,
      chartConfig,
      summary,
      sql: finalSql,
      rowCount: finalData.length,
    });
  } catch (error) {
    req.log.error(error, "Failed to process AI query");
    res.json({
      data: [],
      chartType: "none",
      summary: "An unexpected error occurred. Please try again.",
      rowCount: 0,
    });
  }
});

export default router;
