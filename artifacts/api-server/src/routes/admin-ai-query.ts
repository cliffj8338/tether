import { Router, type IRouter } from "express";
import { anthropic } from "@workspace/integrations-anthropic-ai";
import { db } from "@workspace/db";
import { sql } from "drizzle-orm";
import { requireAdmin } from "../lib/require-admin";
import { QUERY_TEMPLATES, TEMPLATE_INDEX, type QueryTemplate } from "./ai-query-templates";

const router: IRouter = Router();

router.use("/admin/analytics", requireAdmin);

const CLASSIFIER_SYSTEM = `You are a query classifier for Tether, a supervised kids messaging platform analytics dashboard.

Given a user's natural language question, select the BEST matching query template from this list:

${TEMPLATE_INDEX}

If no template is a close match, respond with "none".

Rules:
- Pick the single best matching template ID
- Consider synonyms and related concepts (e.g., "what are kids discussing" → topics_distribution)
- "response time" or "how fast" → response_time_by_age
- "topics" or "talking about" → topics_distribution
- "alerts" + "hour" or "when" or "time" → alert_rates_by_hour
- "alerts" + "level" or "severity" → alert_severity_breakdown
- "emoji" or "slang" → emoji_slang_usage
- "sentiment" + "age" → sentiment_by_age
- "active" or "most conversations" or "most messages" → most_active_children
- "churn" or "at risk" or "leaving" → churn_risk_distribution
- "anxiety" or "mental health" or "wellbeing" → anxiety_scores
- "waitlist" + "role" or "breakdown" → waitlist_by_role
- "waitlist" + "growth" or "over time" or "per day" → waitlist_signups
- "trust level" → trust_level_distribution
- "faith mode" → faith_mode_stats
- "growth" or "overview" or "how many users" → platform_growth
- "network" or "influence" or "social role" → network_roles
- "health score" or "conversation quality" → conversation_health
- "keyword" or "trending words" → keyword_trends
- "interest" or "interested in" → interest_clusters
- "session" or "engagement time" or "duration" → session_engagement
- "message volume" or "messages per day" or "daily messages" → message_volume_trend
- "vocabulary" or "complexity" or "reading level" → vocabulary_complexity_trend
- "emotional" or "emotions" or "tone" → emotional_tone_distribution
- "age distribution" or "how old" → age_distribution
- "topics by age" or "what do [age] talk about" → topics_by_age

Respond with ONLY the template ID (e.g., "topics_distribution") or "none". Nothing else.`;

async function classifyQuestion(question: string): Promise<QueryTemplate | null> {
  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 50,
    system: CLASSIFIER_SYSTEM,
    messages: [{ role: "user", content: question }],
  });

  const templateId = (response.content[0].type === "text" ? response.content[0].text : "").trim().toLowerCase();

  if (templateId === "none") return null;
  return QUERY_TEMPLATES.find(t => t.id === templateId) ?? null;
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

async function generateSummary(question: string, data: unknown[], template: QueryTemplate): Promise<string> {
  const dataPreview = JSON.stringify(data.slice(0, 15));
  const columns = data.length > 0 ? Object.keys(data[0] as any) : [];

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 400,
    system: "You are a research analyst for Tether, a supervised kids messaging platform. Write a clear, insightful 2-4 sentence summary of the query results. Focus on what the data reveals — trends, standout values, implications for child safety or platform growth. Be specific with numbers. Do NOT mention SQL, queries, databases, or technical details. Write as if briefing a non-technical research executive.",
    messages: [
      {
        role: "user",
        content: `Question: "${question}"
Analysis type: ${template.name}
Columns: ${columns.join(", ")}
Total rows: ${data.length}
Data: ${dataPreview}

Write a concise, insightful research summary.`,
      },
    ],
  });

  return response.content[0].type === "text" ? response.content[0].text : "Here are the results.";
}

const FALLBACK_SYSTEM = `You are a PostgreSQL query expert for Tether, a supervised kids messaging platform. Generate a SELECT query for the user's question.

Key tables: users (id, display_name, role, age, grade, trust_level, faith_mode_enabled, parent_id, created_at), messages (id, conversation_id, sender_id, alert_level, is_blocked, created_at), message_analytics (id, message_id, sender_id, sender_age_group, word_count, sentiment_score, sentiment_label, emotional_tone, topic_category, has_emoji, has_slang, response_time_seconds, created_at), alerts (id, parent_id, child_id, alert_level, title, created_at), conversations (id, child_id, contact_id, created_at), behavioral_metrics (user_id, sentiment_mean, anxiety_indicator_score, social_avoidance_score), network_graph (user_id, influence_score, network_role, unique_connections), churn_predictions (user_id, churn_risk_score, days_inactive), waitlist (email, name, role, created_at), keyword_trends (keyword, category, occurrence_count, age_group), conversation_insights (conversation_id, health_score, avg_sentiment_score, dominant_topic), session_tracking (session_id, source, duration_seconds, pages_viewed).

Rules:
- SELECT only. No INSERT/UPDATE/DELETE/DROP.
- Never select email, password_hash, ip_hash, or messages.content
- Use aggregations, GROUP BY, and LIMIT 25
- Use clear column aliases
- Keep results concise (aim for 5-20 rows)
- sender_age_group values: '6-8','9-11','12-14','15+'
- Use CTEs freely

Return ONLY a JSON object: {"sql": "<query>", "chartType": "bar|line|pie|table|number", "chartConfig": {"xKey": "<col>", "yKey": "<col>", "label": "<title>"}}`;

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

async function fallbackQuery(question: string): Promise<{ data: unknown[]; sql: string; chartType: string; chartConfig: Record<string, string> } | null> {
  const messages: { role: "user" | "assistant"; content: string }[] = [
    { role: "user", content: question },
  ];

  for (let attempt = 0; attempt < 3; attempt++) {
    const aiResponse = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 1500,
      system: FALLBACK_SYSTEM,
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
      messages.push({ role: "assistant", content: text });
      messages.push({ role: "user", content: "Your response was not valid JSON. Return ONLY a JSON object with keys: sql, chartType, chartConfig." });
      continue;
    }

    const safeSql = sanitizeSql(parsed.sql ?? "");
    if (!safeSql) {
      messages.push({ role: "assistant", content: text });
      messages.push({ role: "user", content: "The SQL was invalid. Generate a SELECT-only query. No forbidden columns." });
      continue;
    }

    const { data, error } = await executeQuery(safeSql);
    if (error) {
      messages.push({ role: "assistant", content: text });
      messages.push({ role: "user", content: `Query failed: "${error}". Fix the SQL and try again.` });
      continue;
    }

    return {
      data,
      sql: safeSql,
      chartType: parsed.chartType ?? "table",
      chartConfig: parsed.chartConfig ?? {},
    };
  }

  return null;
}

router.post("/admin/analytics/query", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || typeof question !== "string") {
      res.status(400).json({ error: "question is required" });
      return;
    }

    const template = await classifyQuestion(question);

    if (template) {
      const { data, error } = await executeQuery(template.sql + " LIMIT 25");

      if (error) {
        req.log.warn({ templateId: template.id, error }, "Template query failed, falling back");
        const fallback = await fallbackQuery(question);
        if (!fallback || fallback.data.length === 0) {
          res.json({ data: [], chartType: "none", summary: "I couldn't retrieve data for that question. The database may not have matching records yet.", rowCount: 0 });
          return;
        }
        const summary = await generateSummary(question, fallback.data, template);
        res.json({ data: fallback.data, chartType: fallback.chartType, chartConfig: fallback.chartConfig, summary, sql: fallback.sql, rowCount: fallback.data.length });
        return;
      }

      if (data.length === 0) {
        res.json({ data: [], chartType: "none", summary: "No data found for that query. The database may not have records matching your criteria yet.", rowCount: 0 });
        return;
      }

      const summary = await generateSummary(question, data, template);

      res.json({
        data,
        chartType: template.chartType,
        chartConfig: template.chartConfig,
        summary,
        sql: template.sql,
        rowCount: data.length,
      });
    } else {
      const fallback = await fallbackQuery(question);

      if (!fallback || fallback.data.length === 0) {
        res.json({
          data: [],
          chartType: "none",
          summary: "I wasn't able to find a matching analysis for that question. Try asking about topics, sentiment, alerts, engagement, demographics, safety, or growth metrics.",
          rowCount: 0,
        });
        return;
      }

      const dataPreview = JSON.stringify(fallback.data.slice(0, 10));
      const columns = Object.keys(fallback.data[0] as any);

      const summaryResponse = await anthropic.messages.create({
        model: "claude-haiku-4-5",
        max_tokens: 400,
        system: "You are a research analyst for Tether, a supervised kids messaging platform. Write a clear, insightful 2-4 sentence summary. Focus on trends, standout values, and implications. Be specific with numbers. No technical details.",
        messages: [{ role: "user", content: `Question: "${question}"\nColumns: ${columns.join(", ")}\nRows: ${fallback.data.length}\nData: ${dataPreview}\n\nWrite a research summary.` }],
      });

      const summary = summaryResponse.content[0].type === "text" ? summaryResponse.content[0].text : "Here are the results.";

      res.json({
        data: fallback.data,
        chartType: fallback.chartType,
        chartConfig: fallback.chartConfig,
        summary,
        sql: fallback.sql,
        rowCount: fallback.data.length,
      });
    }
  } catch (error) {
    req.log.error(error, "Failed to process AI query");
    res.json({ data: [], chartType: "none", summary: "An unexpected error occurred. Please try again.", rowCount: 0 });
  }
});

export default router;
