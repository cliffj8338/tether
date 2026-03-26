import { useState } from "react";
import { ChevronDown, ChevronRight, Database, Search } from "lucide-react";

interface DataField {
  name: string;
  type: string;
  description: string;
  correlatesWith?: string[];
}

interface DataTable {
  table: string;
  category: string;
  lens: string;
  description: string;
  fields: DataField[];
}

const DATA_CATALOG: DataTable[] = [
  {
    table: "users",
    category: "Core Identity",
    lens: "All Lenses",
    description: "Every registered user (parent or child). Anchor entity for all analytics. Links families, settings, and trust levels.",
    fields: [
      { name: "id", type: "serial PK", description: "Unique user identifier — joins to every analytics table" },
      { name: "display_name", type: "text", description: "User's display name" },
      { name: "role", type: "enum", description: "parent or child — determines access level and analytics segmentation" },
      { name: "parent_id", type: "integer FK", description: "Links child to parent — enables family-level rollups" },
      { name: "age", type: "integer", description: "Child's age — primary demographic segmentation axis", correlatesWith: ["vocabulary_complexity", "sentiment_score", "topic_category", "emoji_to_text_ratio", "trust_level"] },
      { name: "grade", type: "text", description: "School grade — secondary demographic axis" },
      { name: "trust_level", type: "integer 1-5", description: "Parent-set trust level — gates content filtering strictness", correlatesWith: ["alert_level", "is_blocked", "faith_mode_enabled", "sentiment_score"] },
      { name: "faith_mode_enabled", type: "boolean", description: "Christian values filter toggle — per-child setting", correlatesWith: ["alert_level", "topic_category", "faith_mode_flags"] },
      { name: "is_paused", type: "boolean", description: "Account paused by parent — child cannot send/receive messages" },
      { name: "push_token", type: "text", description: "Expo push notification token for real-time alerts" },
      { name: "phone", type: "text", description: "Parent phone for SMS alerts (Level 4-5 only)" },
      { name: "family_code", type: "text unique", description: "TETHER-XXXXXX enrollment code for child onboarding" },
      { name: "created_at", type: "timestamp", description: "Registration date — used for cohort analysis and retention" },
    ],
  },
  {
    table: "contacts",
    category: "Social Graph",
    lens: "Child Psychology / Marketing",
    description: "Approved peer connections. Each contact links two children. Parent approval gate controls social expansion.",
    fields: [
      { name: "child_id", type: "integer FK", description: "The child who owns this contact" },
      { name: "contact_child_id", type: "integer FK", description: "The peer child — creates a bidirectional social edge" },
      { name: "contact_name", type: "text", description: "Display name for the contact" },
      { name: "approved_by_parent", type: "boolean", description: "Parent approval status — tracks parent engagement and oversight patterns", correlatesWith: ["trust_level", "alert_level"] },
      { name: "parent_intro_sent", type: "boolean", description: "Whether parent intro notification was sent" },
      { name: "created_at", type: "timestamp", description: "When contact was added — social network growth rate" },
    ],
  },
  {
    table: "conversations",
    category: "Communication",
    lens: "All Lenses",
    description: "Active messaging threads between a child and a contact. Central entity linking messages, analytics, and insights.",
    fields: [
      { name: "child_id", type: "integer FK", description: "The child participant" },
      { name: "contact_id", type: "integer FK", description: "The contact in this conversation" },
      { name: "last_message_preview", type: "text", description: "Most recent message text (truncated)" },
      { name: "last_message_at", type: "timestamp", description: "Last activity — used for staleness detection and churn signals", correlatesWith: ["churn_risk_score", "days_inactive"] },
      { name: "unread_count", type: "integer", description: "Unread messages — engagement signal", correlatesWith: ["social_avoidance_score", "response_time_seconds"] },
      { name: "is_paused", type: "boolean", description: "Conversation paused by parent" },
    ],
  },
  {
    table: "messages",
    category: "Communication",
    lens: "All Lenses",
    description: "Every message sent through Tether. Raw communication data before NLP analysis. Source of truth for content.",
    fields: [
      { name: "conversation_id", type: "integer FK", description: "Links to conversation thread" },
      { name: "sender_id", type: "integer FK", description: "Who sent it — joins to users for demographic context" },
      { name: "content", type: "text", description: "Raw message text (PII — never exposed in analytics queries)" },
      { name: "alert_level", type: "enum none-level5", description: "Content safety classification from AI filter", correlatesWith: ["trust_level", "faith_mode_enabled", "topic_category", "emotional_tone", "sentiment_score"] },
      { name: "flag_reason", type: "text", description: "Why the message was flagged — natural language explanation from AI" },
      { name: "is_blocked", type: "boolean", description: "Whether message was blocked from delivery", correlatesWith: ["alert_level", "trust_level"] },
      { name: "is_delivered", type: "boolean", description: "Delivery status" },
      { name: "created_at", type: "timestamp", description: "Send timestamp — temporal analysis, hourly/daily patterns", correlatesWith: ["response_time_seconds", "interaction_depth"] },
    ],
  },
  {
    table: "alerts",
    category: "Safety & Moderation",
    lens: "Child Psychology / Marketing",
    description: "Parent notifications generated when content filtering flags a message. Tracks parent review behavior and response times.",
    fields: [
      { name: "parent_id", type: "integer FK", description: "Which parent received the alert" },
      { name: "child_id", type: "integer FK", description: "Which child triggered it" },
      { name: "message_id", type: "integer FK", description: "The flagged message" },
      { name: "alert_level", type: "enum", description: "Severity level 1-5 — correlates with content type and child profile", correlatesWith: ["trust_level", "topic_category", "emotional_tone", "age"] },
      { name: "title", type: "text", description: "Alert headline" },
      { name: "description", type: "text", description: "Detailed alert description" },
      { name: "is_read", type: "boolean", description: "Whether parent reviewed — tracks parent engagement and oversight diligence", correlatesWith: ["response_time_seconds", "trust_level"] },
      { name: "created_at", type: "timestamp", description: "Alert timestamp — response time = is_read time - created_at" },
    ],
  },
  {
    table: "message_analytics",
    category: "NLP Intelligence",
    lens: "Child Psychology / Data Science",
    description: "AI-extracted features from every message. Claude analyzes sentiment, emotion, topic, vocabulary, interests, and communication patterns in real time.",
    fields: [
      { name: "message_id", type: "integer FK", description: "Source message" },
      { name: "sender_id", type: "integer FK", description: "Message author — joins to users for demographic splits" },
      { name: "sender_age_group", type: "text", description: "Age bucket (6-8, 9-11, 12-14, 15-17) for cross-age comparison" },
      { name: "word_count", type: "integer", description: "Total words — language development marker", correlatesWith: ["age", "vocabulary_complexity", "cognitive_fatigue_score"] },
      { name: "sentence_count", type: "integer", description: "Sentence count — communication structure indicator" },
      { name: "avg_word_length", type: "real", description: "Average word length — reading level proxy" },
      { name: "vocabulary_complexity", type: "real 0-1", description: "Lexical sophistication score — tracks language development over time", correlatesWith: ["age", "grade", "topic_category"] },
      { name: "sentiment_score", type: "real -1 to 1", description: "Emotional valence: -1 very negative → +1 very positive", correlatesWith: ["emotional_tone", "alert_level", "topic_category", "time_of_day", "anxiety_indicator_score"] },
      { name: "sentiment_label", type: "enum", description: "Categorical sentiment: very_negative, negative, neutral, positive, very_positive" },
      { name: "emotional_tone", type: "enum (16 types)", description: "Primary emotion: joy, sadness, anger, fear, surprise, disgust, trust, anticipation, curiosity, empathy, anxiety, pride, shame, gratitude, loneliness, neutral", correlatesWith: ["sentiment_score", "topic_category", "age", "time_of_day"] },
      { name: "topic_category", type: "enum (15 types)", description: "Content domain: social, emotional, academic, faith, conflict, humor, family, friendship, identity, health, media, creative, sports, technology, other", correlatesWith: ["age", "sentiment_score", "emotional_tone", "alert_level"] },
      { name: "topic_keywords", type: "jsonb array", description: "Specific extracted keywords — TV shows, games, books, people, places, activities", correlatesWith: ["interest_nouns", "interest_cluster"] },
      { name: "has_emoji", type: "boolean", description: "Whether message contains emoji", correlatesWith: ["age", "emoji_to_text_ratio", "cognitive_fatigue_score"] },
      { name: "has_slang", type: "boolean", description: "Whether message contains slang/informal language", correlatesWith: ["age", "vocabulary_complexity"] },
      { name: "emoji_to_text_ratio", type: "real", description: "Emoji density — rising ratio with falling length signals cognitive fatigue", correlatesWith: ["message_length", "cognitive_fatigue_score", "age"] },
      { name: "message_length", type: "integer", description: "Character count — declining length is a churn indicator", correlatesWith: ["word_count", "message_length_gradient", "churn_risk_score"] },
      { name: "interest_nouns", type: "jsonb array", description: "Extracted subject nouns: games (Minecraft, Roblox), shows (SpongeBob), books (Harry Potter), sports (basketball), etc.", correlatesWith: ["topic_category", "interest_cluster", "age"] },
      { name: "interest_verbs", type: "jsonb array", description: "Extracted action verbs: playing, watching, reading, building, drawing — reveals activity patterns", correlatesWith: ["topic_category", "interest_nouns"] },
      { name: "interaction_depth", type: "integer", description: "How deep in the conversation thread this message is — higher = sustained engagement", correlatesWith: ["response_time_seconds", "conversation_depth"] },
      { name: "response_time_seconds", type: "integer", description: "Seconds since last message from other party — engagement speed metric", correlatesWith: ["anxiety_indicator_score", "social_avoidance_score", "churn_risk_score", "time_of_day"] },
      { name: "is_conversation_starter", type: "boolean", description: "First message in a thread — measures initiation behavior", correlatesWith: ["initiation_rate", "influence_score"] },
    ],
  },
  {
    table: "conversation_insights",
    category: "Conversation Health",
    lens: "Child Psychology",
    description: "Aggregated per-conversation metrics. Tracks conversation health, topic diversity, communication balance, and relationship dynamics.",
    fields: [
      { name: "conversation_id", type: "integer FK", description: "The analyzed conversation" },
      { name: "total_messages", type: "integer", description: "Message count — conversation activity level" },
      { name: "avg_sentiment_score", type: "real", description: "Mean sentiment across all messages in conversation", correlatesWith: ["health_score", "sentiment_trend"] },
      { name: "sentiment_trend", type: "text", description: "Trending direction: improving, stable, declining — early warning signal" },
      { name: "dominant_topic", type: "enum", description: "Most frequent topic category in the conversation" },
      { name: "topic_distribution", type: "jsonb", description: "Percentage breakdown across all 15 topic categories — conversation breadth" },
      { name: "avg_response_time_seconds", type: "real", description: "Mean response latency — conversation engagement quality" },
      { name: "avg_word_count", type: "real", description: "Mean message length — effort level" },
      { name: "vocabulary_diversity", type: "real", description: "Unique words / total words — language richness", correlatesWith: ["age", "vocabulary_complexity"] },
      { name: "emotional_range", type: "jsonb", description: "Distribution of emotional tones — narrow range may signal emotional suppression" },
      { name: "communication_balance", type: "real 0-1", description: "How evenly both parties contribute — 1.0 = perfectly balanced", correlatesWith: ["reciprocity_score", "influence_score"] },
      { name: "conversation_depth", type: "real", description: "Sustained topic exploration vs surface-level chat" },
      { name: "health_score", type: "real 0-1", description: "Composite conversation health: sentiment + balance + depth + response time" },
    ],
  },
  {
    table: "keyword_trends",
    category: "Content Intelligence",
    lens: "Data Science / Marketing",
    description: "Temporal keyword tracking. Shows what topics, interests, and cultural references are trending across the platform by age group.",
    fields: [
      { name: "keyword", type: "text", description: "The tracked keyword (game name, show title, slang term, etc.)" },
      { name: "category", type: "enum", description: "Topic category this keyword belongs to" },
      { name: "occurrence_count", type: "integer", description: "How many times it appeared in the period" },
      { name: "age_group", type: "text", description: "Which age cohort used this keyword" },
      { name: "period_start/end", type: "timestamp", description: "Time window — enables trend over time analysis" },
    ],
  },
  {
    table: "safety_analytics",
    category: "Safety & Moderation",
    lens: "Child Psychology / Marketing",
    description: "Periodic safety snapshots. Tracks content filtering effectiveness, false positive rates, and safety trends over time.",
    fields: [
      { name: "total_messages", type: "integer", description: "Messages in period" },
      { name: "total_flagged", type: "integer", description: "Messages flagged by AI filter", correlatesWith: ["faith_mode_flags", "alert_level"] },
      { name: "level1-5_count", type: "integer", description: "Breakdown by alert severity level" },
      { name: "blocked_count", type: "integer", description: "Messages blocked from delivery" },
      { name: "avg_response_time_minutes", type: "real", description: "How fast parents review alerts — parental engagement metric", correlatesWith: ["is_read", "alert_level"] },
      { name: "false_positive_rate", type: "real", description: "Rate of incorrect flags — filter accuracy metric" },
      { name: "top_flag_categories", type: "jsonb", description: "Most common reasons for flagging" },
      { name: "faith_mode_flags", type: "integer", description: "Flags triggered specifically by faith mode filter", correlatesWith: ["faith_mode_enabled"] },
      { name: "age_group_breakdown", type: "jsonb", description: "Safety events by age group — which ages trigger most alerts" },
    ],
  },
  {
    table: "demographic_snapshots",
    category: "Platform Growth",
    lens: "Marketing / Data Science",
    description: "Daily platform snapshots. User growth, retention, engagement, and demographic distribution over time.",
    fields: [
      { name: "total_families/parents/children", type: "integer", description: "Platform size metrics" },
      { name: "age_distribution", type: "jsonb", description: "Children by age bucket" },
      { name: "grade_distribution", type: "jsonb", description: "Children by school grade" },
      { name: "faith_mode_adoption", type: "real", description: "Percentage of children with faith mode enabled — feature adoption" },
      { name: "avg_children_per_family", type: "real", description: "Family size — expansion metric" },
      { name: "trust_level_distribution", type: "jsonb", description: "How parents set trust levels — strictness distribution" },
      { name: "active_users_last_7d/30d", type: "integer", description: "Active user counts — DAU/WAU/MAU", correlatesWith: ["churn_risk_score", "retention_rate"] },
      { name: "new_signups_last_7d", type: "integer", description: "Growth rate" },
      { name: "retention_rate_7d/30d", type: "real", description: "Percentage of users returning — retention health", correlatesWith: ["churn_risk_score", "session_frequency_gradient"] },
    ],
  },
  {
    table: "behavioral_metrics",
    category: "Behavioral Intelligence",
    lens: "Child Psychology",
    description: "Daily per-user behavioral analysis. Sentiment volatility, anxiety indicators, cognitive fatigue, social avoidance — computed from message_analytics.",
    fields: [
      { name: "user_id", type: "integer FK", description: "The child being analyzed" },
      { name: "period_date", type: "timestamp", description: "Analysis date — one row per user per day" },
      { name: "sentiment_volatility", type: "real", description: "Standard deviation of sentiment scores — emotional stability metric", correlatesWith: ["anxiety_indicator_score", "emotional_tone", "age"] },
      { name: "sentiment_mean/min/max", type: "real", description: "Sentiment distribution — mean shows baseline mood, range shows emotional breadth" },
      { name: "avg_response_latency_seconds", type: "real", description: "Average time to respond — rising latency = disengagement signal", correlatesWith: ["churn_risk_score", "social_avoidance_score"] },
      { name: "response_latency_stddev", type: "real", description: "Variability in response times — inconsistency signal" },
      { name: "emoji_to_text_ratio", type: "real", description: "Daily emoji density — compare to trend line", correlatesWith: ["cognitive_fatigue_score", "age", "message_length"] },
      { name: "emoji_to_text_ratio_trend", type: "real", description: "Direction of emoji ratio change" },
      { name: "avg_message_length", type: "real", description: "Daily average message length", correlatesWith: ["message_length_gradient", "churn_risk_score"] },
      { name: "message_length_trend", type: "real", description: "Direction of message length change — declining = potential disengagement" },
      { name: "cognitive_fatigue_score", type: "real 0-1", description: "Rising emoji + falling length = cognitive fatigue. 0 = alert, 1 = exhausted", correlatesWith: ["emoji_to_text_ratio", "avg_message_length", "time_of_day"] },
      { name: "messages_analyzed", type: "integer", description: "Sample size for this day's computation — confidence indicator" },
      { name: "anxiety_indicator_score", type: "real 0-1", description: "Composite: volatility(30%) + latency(30%) + fatigue(20%) + negativity(20%)", correlatesWith: ["sentiment_volatility", "response_time_seconds", "emotional_tone", "topic_category"] },
      { name: "social_avoidance_score", type: "real 0-1", description: "Percentage of responses over 10 minutes — withdrawal signal", correlatesWith: ["churn_risk_score", "days_inactive", "reciprocity_score"] },
    ],
  },
  {
    table: "network_graph",
    category: "Social Network",
    lens: "Data Science / Child Psychology",
    description: "Per-user social network position. Influence, reciprocity, and network role assignment — computed from messaging patterns.",
    fields: [
      { name: "user_id", type: "integer FK", description: "The analyzed user" },
      { name: "period_date", type: "timestamp", description: "Analysis date" },
      { name: "influence_score", type: "real 0-1", description: "Weighted: reply_trigger(40%) + initiation(30%) + connectivity(30%)", correlatesWith: ["network_role", "reply_trigger_rate", "messages_sent"] },
      { name: "reply_trigger_rate", type: "real 0-1", description: "What percentage of this user's messages trigger replies — content influence", correlatesWith: ["influence_score", "sentiment_score"] },
      { name: "downstream_actions", type: "integer", description: "Total replies triggered — absolute influence volume" },
      { name: "unique_connections", type: "integer", description: "Number of distinct peers messaged — social breadth", correlatesWith: ["social_avoidance_score", "network_role"] },
      { name: "messages_sent/received", type: "integer", description: "Volume metrics — communication load" },
      { name: "initiation_rate", type: "real 0-1", description: "Conversation starters / total sent — proactiveness", correlatesWith: ["network_role", "is_conversation_starter"] },
      { name: "reciprocity_score", type: "real 0-1", description: "Balance of sent vs received — 1.0 = perfectly balanced exchange", correlatesWith: ["communication_balance", "social_avoidance_score"] },
      { name: "network_role", type: "text", description: "Classified as: leader, initiator, influencer, observer, participant", correlatesWith: ["age", "trust_level", "influence_score"] },
      { name: "cluster_membership", type: "text", description: "Social cluster identifier — group affiliation" },
    ],
  },
  {
    table: "churn_predictions",
    category: "Predictive Analytics",
    lens: "Marketing / Data Science",
    description: "Per-user churn risk assessment. Silence Gradient model predicts user departure based on behavioral trajectory changes.",
    fields: [
      { name: "user_id", type: "integer FK", description: "The at-risk user" },
      { name: "churn_risk_score", type: "real 0-1", description: "Probability of churn — above 0.7 = high risk", correlatesWith: ["days_inactive", "silence_gradient", "retention_rate"] },
      { name: "predicted_churn_date", type: "timestamp", description: "Estimated departure date" },
      { name: "confidence_level", type: "real 0-1", description: "Model confidence based on data volume" },
      { name: "silence_gradient", type: "real", description: "Days inactive / 14 — how quickly user went quiet", correlatesWith: ["days_inactive", "social_avoidance_score"] },
      { name: "message_length_gradient", type: "real", description: "Change rate of message lengths — negative = shrinking messages", correlatesWith: ["avg_message_length", "cognitive_fatigue_score"] },
      { name: "response_time_gradient", type: "real", description: "Change rate of response times — positive = slowing down", correlatesWith: ["avg_response_latency_seconds", "social_avoidance_score"] },
      { name: "session_frequency_gradient", type: "real", description: "Change rate of session frequency — negative = fewer sessions", correlatesWith: ["active_users_last_7d", "retention_rate"] },
      { name: "days_inactive", type: "integer", description: "Days since last message — direct inactivity measure" },
      { name: "risk_factors", type: "jsonb array", description: "List: shrinking_message_length, increasing_response_time, extended_silence, declining_sessions" },
    ],
  },
  {
    table: "temporal_anomalies",
    category: "Anomaly Detection",
    lens: "Data Science",
    description: "Detected statistical anomalies — Black Swan events, unusual spikes/drops in any metric across the platform.",
    fields: [
      { name: "anomaly_type", type: "text", description: "Classification of the anomaly" },
      { name: "severity", type: "real", description: "How extreme the deviation is" },
      { name: "metric_name", type: "text", description: "Which metric deviated — any tracked metric can trigger", correlatesWith: ["all metrics"] },
      { name: "baseline_value", type: "real", description: "Expected/normal value" },
      { name: "observed_value", type: "real", description: "Actual observed value" },
      { name: "percent_change", type: "real", description: "Percentage deviation from baseline" },
      { name: "time_window_minutes", type: "integer", description: "Detection window size" },
      { name: "affected_users", type: "integer", description: "How many users were impacted" },
      { name: "metadata", type: "jsonb", description: "Additional context about the anomaly" },
      { name: "resolved", type: "boolean", description: "Whether the anomaly has been investigated/resolved" },
    ],
  },
  {
    table: "interest_graph",
    category: "Interest Intelligence",
    lens: "Marketing / Child Psychology",
    description: "Clustered interests by age group. What kids talk about — TV shows, games, books, sports, music — with sentiment and volume.",
    fields: [
      { name: "age_group", type: "text", description: "Age cohort (6-8, 9-11, 12-14, 15-17)" },
      { name: "period_date", type: "timestamp", description: "Analysis period" },
      { name: "interest_cluster", type: "text", description: "Cluster label (gaming, streaming, sports, reading, etc.)", correlatesWith: ["topic_category", "age", "sentiment_affinity"] },
      { name: "nouns", type: "jsonb array", description: "Specific subjects: Minecraft, Roblox, Spider-Man, Harry Potter, Taylor Swift, etc." },
      { name: "verbs", type: "jsonb array", description: "Activities: playing, watching, reading, drawing, building, etc." },
      { name: "occurrence_count", type: "integer", description: "How frequently this cluster appears" },
      { name: "sentiment_affinity", type: "real", description: "Average sentiment when discussing this interest — enthusiasm level", correlatesWith: ["sentiment_score", "emotional_tone"] },
    ],
  },
  {
    table: "analytics_events",
    category: "Raw Event Stream",
    lens: "Data Science / Marketing",
    description: "Every tracked event from app, web, and API. Raw event stream for custom analysis and funnel building.",
    fields: [
      { name: "source", type: "enum", description: "Event origin: app (mobile), web (marketing site), api (server-side)" },
      { name: "event_name", type: "text", description: "Event type: page_view, screen_view, waitlist_signup, message_sent, alert_created, etc." },
      { name: "session_id", type: "text", description: "Groups events into user sessions — funnel analysis" },
      { name: "user_id", type: "integer FK", description: "Authenticated user (null for anonymous web visitors)" },
      { name: "metadata", type: "jsonb", description: "Flexible event payload — screen name, button clicked, feature used, etc." },
      { name: "page_url", type: "text", description: "Page URL for web events — traffic analysis" },
      { name: "referrer", type: "text", description: "Traffic source — marketing attribution" },
      { name: "user_agent", type: "text", description: "Browser/device string — platform breakdown" },
    ],
  },
  {
    table: "session_tracking",
    category: "Session Intelligence",
    lens: "Marketing / Data Science",
    description: "User session lifecycle. Duration, pages viewed, device info, platform — tracks engagement quality and app stickiness.",
    fields: [
      { name: "session_id", type: "text unique", description: "Session identifier" },
      { name: "source", type: "enum", description: "Where: app or web" },
      { name: "user_id", type: "integer FK", description: "Authenticated user" },
      { name: "duration_seconds", type: "integer", description: "Session length — engagement depth metric", correlatesWith: ["pages_viewed", "events_count", "churn_risk_score"] },
      { name: "pages_viewed", type: "integer", description: "Pages/screens visited in session" },
      { name: "events_count", type: "integer", description: "Total events fired — interaction density" },
      { name: "device_type", type: "text", description: "mobile, tablet, desktop" },
      { name: "platform", type: "text", description: "iOS, Android, web" },
      { name: "screen_resolution", type: "text", description: "Device screen size" },
      { name: "app_version", type: "text", description: "App version — tracks adoption of updates" },
    ],
  },
  {
    table: "waitlist",
    category: "Growth Pipeline",
    lens: "Marketing",
    description: "Pre-launch waitlist signups from the marketing website. Tracks interest by segment.",
    fields: [
      { name: "email", type: "text unique", description: "Signup email" },
      { name: "name", type: "text", description: "Signup name" },
      { name: "role", type: "enum", description: "Interest segment: parent, school, church — market sizing" },
      { name: "created_at", type: "timestamp", description: "Signup date — growth velocity" },
    ],
  },
];

const CORRELATION_EXAMPLES = [
  { question: "Does anxiety score correlate with time of day?", tables: ["behavioral_metrics", "message_analytics"] },
  { question: "Do children with higher trust levels produce fewer alerts?", tables: ["users", "alerts"] },
  { question: "Does faith mode increase or decrease message blocking rates?", tables: ["users", "messages", "safety_analytics"] },
  { question: "Which interest clusters have the highest positive sentiment?", tables: ["interest_graph", "message_analytics"] },
  { question: "Do influencers (network role) have lower churn risk?", tables: ["network_graph", "churn_predictions"] },
  { question: "Does vocabulary complexity increase with age?", tables: ["message_analytics", "users"] },
  { question: "Are children with high social avoidance scores also high churn risks?", tables: ["behavioral_metrics", "churn_predictions"] },
  { question: "What topics trend differently between age groups?", tables: ["keyword_trends", "message_analytics"] },
  { question: "Do longer sessions correlate with more positive sentiment?", tables: ["session_tracking", "message_analytics"] },
  { question: "Which network roles generate the most safety alerts?", tables: ["network_graph", "alerts"] },
];

const LENS_COLORS: Record<string, string> = {
  "Child Psychology": "bg-purple-100 text-purple-700",
  "Marketing": "bg-blue-100 text-blue-700",
  "Data Science": "bg-emerald-100 text-emerald-700",
  "All Lenses": "bg-gray-100 text-gray-700",
};

function LensBadge({ lens }: { lens: string }) {
  const parts = lens.split(" / ");
  return (
    <div className="flex gap-1 flex-wrap">
      {parts.map(p => (
        <span key={p} className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${LENS_COLORS[p.trim()] ?? "bg-gray-100 text-gray-700"}`}>
          {p.trim()}
        </span>
      ))}
    </div>
  );
}

function TableSection({ data, defaultOpen }: { data: DataTable; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen ?? false);

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-card hover:bg-muted/50 transition-colors text-left"
      >
        {open ? <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" /> : <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-sm font-semibold text-foreground">{data.table}</span>
            <span className="text-xs text-muted-foreground">({data.fields.length} fields)</span>
            <span className="px-2 py-0.5 rounded bg-muted text-[10px] font-medium text-muted-foreground">{data.category}</span>
            <LensBadge lens={data.lens} />
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{data.description}</p>
        </div>
      </button>

      {open && (
        <div className="border-t">
          <p className="px-4 py-2 text-xs text-muted-foreground bg-muted/30">{data.description}</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-muted-foreground bg-muted/20">
                <th className="text-left py-2 px-4 w-[200px]">Field</th>
                <th className="text-left py-2 px-4 w-[120px]">Type</th>
                <th className="text-left py-2 px-4">Description</th>
                <th className="text-left py-2 px-4 w-[200px]">Correlates With</th>
              </tr>
            </thead>
            <tbody>
              {data.fields.map((f, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="py-1.5 px-4 font-mono text-xs">{f.name}</td>
                  <td className="py-1.5 px-4 text-xs text-muted-foreground">{f.type}</td>
                  <td className="py-1.5 px-4 text-xs">{f.description}</td>
                  <td className="py-1.5 px-4">
                    {f.correlatesWith ? (
                      <div className="flex flex-wrap gap-1">
                        {f.correlatesWith.slice(0, 4).map((c, j) => (
                          <span key={j} className="px-1.5 py-0.5 bg-primary/10 text-primary rounded text-[10px]">{c}</span>
                        ))}
                        {f.correlatesWith.length > 4 && <span className="text-[10px] text-muted-foreground">+{f.correlatesWith.length - 4}</span>}
                      </div>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function DataCatalog() {
  const [search, setSearch] = useState("");
  const [filterLens, setFilterLens] = useState<string>("all");

  const totalFields = DATA_CATALOG.reduce((s, t) => s + t.fields.length, 0);
  const totalCorrelations = DATA_CATALOG.reduce((s, t) => s + t.fields.filter(f => f.correlatesWith).length, 0);

  const filtered = DATA_CATALOG.filter(t => {
    if (filterLens !== "all" && !t.lens.includes(filterLens)) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return t.table.includes(q) || t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q) ||
      t.fields.some(f => f.name.includes(q) || f.description.toLowerCase().includes(q));
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Data Catalog</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Complete inventory of every tracked data point across the Tether platform — {DATA_CATALOG.length} tables, {totalFields} fields, {totalCorrelations} correlation links
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="border rounded-lg p-4">
          <p className="text-2xl font-bold">{DATA_CATALOG.length}</p>
          <p className="text-xs text-muted-foreground">Data Tables</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-2xl font-bold">{totalFields}</p>
          <p className="text-xs text-muted-foreground">Tracked Fields</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-2xl font-bold">{totalCorrelations}</p>
          <p className="text-xs text-muted-foreground">Correlation Links</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-2xl font-bold">3</p>
          <p className="text-xs text-muted-foreground">Research Lenses</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search tables, fields, descriptions..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="flex gap-1">
          {["all", "Child Psychology", "Marketing", "Data Science"].map(lens => (
            <button
              key={lens}
              onClick={() => setFilterLens(lens)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterLens === lens ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {lens === "all" ? "All" : lens}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {filtered.map(t => <TableSection key={t.table} data={t} />)}
      </div>

      <div className="border rounded-lg p-4 bg-card">
        <h2 className="font-semibold text-foreground mb-3">Example Correlation Queries</h2>
        <p className="text-xs text-muted-foreground mb-3">Ask these in the AI Research Assistant — correlations are computed on demand from the live database.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {CORRELATION_EXAMPLES.map((ex, i) => (
            <div key={i} className="flex gap-2 items-start text-sm p-2 rounded bg-muted/30">
              <span className="text-primary font-mono text-xs mt-0.5">{i + 1}.</span>
              <div>
                <p className="text-foreground text-xs">{ex.question}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Tables: {ex.tables.map(t => <span key={t} className="font-mono">{t}</span>).reduce((a, b) => <>{a} + {b}</>)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border rounded-lg p-4 bg-muted/30">
        <h2 className="font-semibold text-foreground mb-2">How Correlations Work</h2>
        <div className="space-y-2 text-xs text-muted-foreground">
          <p>Every field marked with correlation links can be cross-referenced with any other tracked field. The AI Research Assistant orchestrates these correlations on demand by:</p>
          <ol className="list-decimal ml-4 space-y-1">
            <li>Interpreting your natural language question</li>
            <li>Identifying which tables and fields to JOIN</li>
            <li>Generating an optimized SQL query with proper aggregations</li>
            <li>Running it against the live database (read-only, PII-stripped)</li>
            <li>Returning results with automatic chart type selection</li>
          </ol>
          <p className="text-foreground font-medium mt-2">Any combination of the {totalFields} fields across {DATA_CATALOG.length} tables can be correlated. No pre-built reports needed.</p>
        </div>
      </div>
    </div>
  );
}
