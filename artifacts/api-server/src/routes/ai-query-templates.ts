export interface QueryTemplate {
  id: string;
  name: string;
  description: string;
  sql: string;
  chartType: "bar" | "line" | "pie" | "table" | "number";
  chartConfig: { xKey: string; yKey: string; label: string };
  params?: string[];
}

export const QUERY_TEMPLATES: QueryTemplate[] = [
  {
    id: "topics_distribution",
    name: "Topic Distribution",
    description: "What topics children are talking about, most popular conversation topics",
    sql: `SELECT topic_category, COUNT(*) as message_count,
      ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER(), 1) as percentage
      FROM message_analytics
      WHERE topic_category IS NOT NULL
      GROUP BY topic_category
      ORDER BY message_count DESC`,
    chartType: "pie",
    chartConfig: { xKey: "topic_category", yKey: "message_count", label: "Conversation Topics" },
  },
  {
    id: "sentiment_by_age",
    name: "Sentiment by Age Group",
    description: "Sentiment trends, scores, or distribution broken down by age group",
    sql: `SELECT sender_age_group as age_group,
      COUNT(*) as total_messages,
      ROUND(AVG(sentiment_score)::NUMERIC, 2) as avg_sentiment,
      ROUND(100.0 * COUNT(*) FILTER (WHERE sentiment_label IN ('positive','very_positive')) / NULLIF(COUNT(*),0), 1) as pct_positive,
      ROUND(100.0 * COUNT(*) FILTER (WHERE sentiment_label IN ('negative','very_negative')) / NULLIF(COUNT(*),0), 1) as pct_negative
      FROM message_analytics
      WHERE sender_age_group IS NOT NULL
      GROUP BY sender_age_group
      ORDER BY CASE sender_age_group WHEN '6-8' THEN 1 WHEN '9-11' THEN 2 WHEN '12-14' THEN 3 WHEN '15+' THEN 4 END`,
    chartType: "bar",
    chartConfig: { xKey: "age_group", yKey: "avg_sentiment", label: "Average Sentiment by Age Group" },
  },
  {
    id: "alert_rates_by_hour",
    name: "Alert Rates by Hour",
    description: "Which hours have highest alerts, alert timing, peak risk periods, when do alerts happen",
    sql: `SELECT EXTRACT(HOUR FROM created_at)::INT as hour_of_day,
      COUNT(*) as alert_count,
      COUNT(DISTINCT child_id) as unique_children,
      ROUND(100.0 * COUNT(*) FILTER (WHERE alert_level IN ('level4','level5')) / NULLIF(COUNT(*),0), 1) as high_severity_pct
      FROM alerts
      WHERE created_at IS NOT NULL
      GROUP BY EXTRACT(HOUR FROM created_at)::INT
      ORDER BY hour_of_day`,
    chartType: "bar",
    chartConfig: { xKey: "hour_of_day", yKey: "alert_count", label: "Alerts by Hour of Day" },
  },
  {
    id: "waitlist_signups",
    name: "Waitlist Signups Over Time",
    description: "Waitlist growth, signups per day/week, waitlist trends",
    sql: `SELECT DATE_TRUNC('day', created_at)::DATE as signup_date,
      COUNT(*) as signups,
      SUM(COUNT(*)) OVER (ORDER BY DATE_TRUNC('day', created_at)) as cumulative_total
      FROM waitlist
      GROUP BY DATE_TRUNC('day', created_at)
      ORDER BY signup_date DESC
      LIMIT 25`,
    chartType: "line",
    chartConfig: { xKey: "signup_date", yKey: "cumulative_total", label: "Cumulative Waitlist Signups" },
  },
  {
    id: "response_time_by_age",
    name: "Response Time by Age Group",
    description: "Average response time, how quickly children respond, response latency by age",
    sql: `SELECT sender_age_group as age_group,
      COUNT(*) as total_messages,
      ROUND(AVG(NULLIF(response_time_seconds, 0))::NUMERIC, 0) as avg_response_seconds,
      ROUND(MIN(NULLIF(response_time_seconds, 0))::NUMERIC, 0) as min_response_seconds,
      ROUND(MAX(NULLIF(response_time_seconds, 0))::NUMERIC, 0) as max_response_seconds
      FROM message_analytics
      WHERE sender_age_group IS NOT NULL AND response_time_seconds > 0
      GROUP BY sender_age_group
      ORDER BY CASE sender_age_group WHEN '6-8' THEN 1 WHEN '9-11' THEN 2 WHEN '12-14' THEN 3 WHEN '15+' THEN 4 END`,
    chartType: "bar",
    chartConfig: { xKey: "age_group", yKey: "avg_response_seconds", label: "Avg Response Time (seconds) by Age" },
  },
  {
    id: "most_active_children",
    name: "Most Active Children",
    description: "Which children have the most conversations, most active users, most messages",
    sql: `SELECT u.id as child_id, u.display_name, u.age, u.grade, u.trust_level,
      COUNT(DISTINCT c.id) as conversation_count,
      COUNT(m.id) as message_count
      FROM users u
      JOIN conversations c ON c.child_id = u.id
      LEFT JOIN messages m ON m.conversation_id = c.id AND m.sender_id = u.id
      WHERE u.role = 'child'
      GROUP BY u.id, u.display_name, u.age, u.grade, u.trust_level
      ORDER BY message_count DESC
      LIMIT 20`,
    chartType: "bar",
    chartConfig: { xKey: "display_name", yKey: "message_count", label: "Most Active Children by Messages" },
  },
  {
    id: "emoji_slang_usage",
    name: "Emoji and Slang Usage",
    description: "Percentage of messages with emoji vs slang, emoji usage, slang usage, communication style",
    sql: `SELECT
      COUNT(*) as total_messages,
      COUNT(*) FILTER (WHERE has_emoji) as with_emoji,
      COUNT(*) FILTER (WHERE has_slang) as with_slang,
      COUNT(*) FILTER (WHERE has_emoji AND has_slang) as with_both,
      ROUND(100.0 * COUNT(*) FILTER (WHERE has_emoji) / NULLIF(COUNT(*),0), 1) as pct_emoji,
      ROUND(100.0 * COUNT(*) FILTER (WHERE has_slang) / NULLIF(COUNT(*),0), 1) as pct_slang
      FROM message_analytics`,
    chartType: "number",
    chartConfig: { xKey: "metric", yKey: "value", label: "Emoji & Slang Usage" },
  },
  {
    id: "vocabulary_complexity_trend",
    name: "Vocabulary Complexity Over Time",
    description: "Vocabulary complexity trends, reading level trends, language sophistication over time",
    sql: `SELECT DATE_TRUNC('day', created_at)::DATE as period,
      ROUND(AVG(vocabulary_complexity)::NUMERIC, 3) as avg_complexity,
      ROUND(AVG(avg_word_length)::NUMERIC, 2) as avg_word_length,
      COUNT(*) as message_count
      FROM message_analytics
      WHERE vocabulary_complexity IS NOT NULL
      GROUP BY DATE_TRUNC('day', created_at)
      ORDER BY period
      LIMIT 25`,
    chartType: "line",
    chartConfig: { xKey: "period", yKey: "avg_complexity", label: "Vocabulary Complexity Over Time" },
  },
  {
    id: "emotional_tone_distribution",
    name: "Emotional Tone Distribution",
    description: "Emotional tones, how children feel, emotional state, joy/sadness/anger distribution",
    sql: `SELECT emotional_tone, COUNT(*) as message_count,
      ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER(), 1) as percentage
      FROM message_analytics
      WHERE emotional_tone IS NOT NULL
      GROUP BY emotional_tone
      ORDER BY message_count DESC`,
    chartType: "bar",
    chartConfig: { xKey: "emotional_tone", yKey: "message_count", label: "Emotional Tone Distribution" },
  },
  {
    id: "safety_overview",
    name: "Safety Overview",
    description: "Safety stats, flagged messages, blocked messages, alert levels breakdown",
    sql: `SELECT
      COUNT(*) as total_messages,
      COUNT(*) FILTER (WHERE alert_level != 'none') as flagged,
      COUNT(*) FILTER (WHERE alert_level = 'level1') as level1,
      COUNT(*) FILTER (WHERE alert_level = 'level2') as level2,
      COUNT(*) FILTER (WHERE alert_level = 'level3') as level3,
      COUNT(*) FILTER (WHERE alert_level = 'level4') as level4,
      COUNT(*) FILTER (WHERE alert_level = 'level5') as level5,
      COUNT(*) FILTER (WHERE is_blocked) as blocked,
      ROUND(100.0 * COUNT(*) FILTER (WHERE alert_level != 'none') / NULLIF(COUNT(*),0), 2) as flag_rate_pct
      FROM messages`,
    chartType: "table",
    chartConfig: { xKey: "metric", yKey: "value", label: "Safety Overview" },
  },
  {
    id: "trust_level_distribution",
    name: "Trust Level Distribution",
    description: "Trust levels, graduated trust, how many children at each trust level",
    sql: `SELECT trust_level, COUNT(*) as child_count,
      ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER(), 1) as percentage
      FROM users
      WHERE role = 'child'
      GROUP BY trust_level
      ORDER BY trust_level`,
    chartType: "bar",
    chartConfig: { xKey: "trust_level", yKey: "child_count", label: "Children by Trust Level" },
  },
  {
    id: "faith_mode_stats",
    name: "Faith Mode Adoption",
    description: "Faith mode usage, how many families use faith mode, faith mode enabled",
    sql: `SELECT
      COUNT(*) as total_families,
      COUNT(*) FILTER (WHERE faith_mode_enabled) as faith_mode_on,
      COUNT(*) FILTER (WHERE NOT faith_mode_enabled) as faith_mode_off,
      ROUND(100.0 * COUNT(*) FILTER (WHERE faith_mode_enabled) / NULLIF(COUNT(*),0), 1) as adoption_rate_pct
      FROM users
      WHERE role = 'parent'`,
    chartType: "pie",
    chartConfig: { xKey: "status", yKey: "count", label: "Faith Mode Adoption" },
  },
  {
    id: "age_distribution",
    name: "Children Age Distribution",
    description: "Age distribution, how old are the children, age breakdown",
    sql: `SELECT age, COUNT(*) as child_count
      FROM users
      WHERE role = 'child' AND age IS NOT NULL
      GROUP BY age
      ORDER BY age`,
    chartType: "bar",
    chartConfig: { xKey: "age", yKey: "child_count", label: "Children by Age" },
  },
  {
    id: "conversation_health",
    name: "Conversation Health Scores",
    description: "Conversation health, healthy vs unhealthy conversations, conversation quality",
    sql: `SELECT
      CASE
        WHEN health_score >= 0.8 THEN 'Excellent (0.8-1.0)'
        WHEN health_score >= 0.6 THEN 'Good (0.6-0.8)'
        WHEN health_score >= 0.4 THEN 'Fair (0.4-0.6)'
        WHEN health_score >= 0.2 THEN 'Poor (0.2-0.4)'
        ELSE 'Critical (0-0.2)'
      END as health_band,
      COUNT(*) as conversation_count,
      ROUND(AVG(total_messages)::NUMERIC, 0) as avg_messages,
      ROUND(AVG(avg_sentiment_score)::NUMERIC, 2) as avg_sentiment
      FROM conversation_insights
      WHERE health_score IS NOT NULL
      GROUP BY health_band
      ORDER BY MIN(health_score) DESC`,
    chartType: "bar",
    chartConfig: { xKey: "health_band", yKey: "conversation_count", label: "Conversation Health Distribution" },
  },
  {
    id: "churn_risk_distribution",
    name: "Churn Risk Distribution",
    description: "Churn risk, at-risk users, user retention risk, who might leave",
    sql: `SELECT
      CASE
        WHEN churn_risk_score >= 0.8 THEN 'Critical (80-100%)'
        WHEN churn_risk_score >= 0.6 THEN 'High (60-80%)'
        WHEN churn_risk_score >= 0.4 THEN 'Medium (40-60%)'
        WHEN churn_risk_score >= 0.2 THEN 'Low (20-40%)'
        ELSE 'Minimal (0-20%)'
      END as risk_level,
      COUNT(*) as user_count,
      ROUND(AVG(days_inactive)::NUMERIC, 0) as avg_days_inactive
      FROM churn_predictions
      WHERE churn_risk_score IS NOT NULL
      GROUP BY risk_level
      ORDER BY MIN(churn_risk_score) DESC`,
    chartType: "bar",
    chartConfig: { xKey: "risk_level", yKey: "user_count", label: "Churn Risk Distribution" },
  },
  {
    id: "network_roles",
    name: "Network Roles",
    description: "Network roles, social roles, leaders, influencers, observers, who influences whom",
    sql: `SELECT network_role, COUNT(*) as user_count,
      ROUND(AVG(influence_score)::NUMERIC, 3) as avg_influence,
      ROUND(AVG(unique_connections)::NUMERIC, 1) as avg_connections,
      ROUND(AVG(messages_sent)::NUMERIC, 0) as avg_messages_sent
      FROM network_graph
      WHERE network_role IS NOT NULL
      GROUP BY network_role
      ORDER BY user_count DESC`,
    chartType: "bar",
    chartConfig: { xKey: "network_role", yKey: "user_count", label: "Social Network Roles" },
  },
  {
    id: "anxiety_scores",
    name: "Anxiety and Wellbeing Indicators",
    description: "Anxiety scores, mental health indicators, wellbeing, social avoidance, cognitive fatigue",
    sql: `SELECT
      CASE
        WHEN u.age < 8 THEN '6-8'
        WHEN u.age < 12 THEN '9-11'
        WHEN u.age < 15 THEN '12-14'
        ELSE '15+'
      END as age_group,
      COUNT(*) as users_measured,
      ROUND(AVG(b.anxiety_indicator_score)::NUMERIC, 3) as avg_anxiety,
      ROUND(AVG(b.social_avoidance_score)::NUMERIC, 3) as avg_social_avoidance,
      ROUND(AVG(b.cognitive_fatigue_score)::NUMERIC, 3) as avg_cognitive_fatigue
      FROM behavioral_metrics b
      JOIN users u ON u.id = b.user_id
      WHERE u.role = 'child' AND u.age IS NOT NULL
      GROUP BY age_group
      ORDER BY CASE age_group WHEN '6-8' THEN 1 WHEN '9-11' THEN 2 WHEN '12-14' THEN 3 WHEN '15+' THEN 4 END`,
    chartType: "bar",
    chartConfig: { xKey: "age_group", yKey: "avg_anxiety", label: "Anxiety Indicators by Age Group" },
  },
  {
    id: "platform_growth",
    name: "Platform Growth",
    description: "Platform growth, user growth, family growth, signups, how many users",
    sql: `SELECT
      (SELECT COUNT(*) FROM users WHERE role = 'parent') as total_parents,
      (SELECT COUNT(*) FROM users WHERE role = 'child') as total_children,
      (SELECT COUNT(DISTINCT parent_id) FROM users WHERE parent_id IS NOT NULL) as total_families,
      (SELECT COUNT(*) FROM conversations) as total_conversations,
      (SELECT COUNT(*) FROM messages) as total_messages,
      (SELECT COUNT(*) FROM waitlist) as waitlist_signups`,
    chartType: "number",
    chartConfig: { xKey: "metric", yKey: "value", label: "Platform Overview" },
  },
  {
    id: "topics_by_age",
    name: "Topics by Age Group",
    description: "What different age groups talk about, topics by age, age-specific interests",
    sql: `SELECT sender_age_group as age_group, topic_category,
      COUNT(*) as message_count
      FROM message_analytics
      WHERE sender_age_group IS NOT NULL AND topic_category IS NOT NULL
      GROUP BY sender_age_group, topic_category
      ORDER BY sender_age_group, message_count DESC`,
    chartType: "table",
    chartConfig: { xKey: "topic_category", yKey: "message_count", label: "Topics by Age Group" },
  },
  {
    id: "alert_severity_breakdown",
    name: "Alert Severity Breakdown",
    description: "Alert levels, severity breakdown, how many level 1-5 alerts",
    sql: `SELECT alert_level, COUNT(*) as alert_count,
      COUNT(DISTINCT child_id) as unique_children,
      ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER(), 1) as percentage
      FROM alerts
      GROUP BY alert_level
      ORDER BY CASE alert_level
        WHEN 'level1' THEN 1 WHEN 'level2' THEN 2 WHEN 'level3' THEN 3
        WHEN 'level4' THEN 4 WHEN 'level5' THEN 5 END`,
    chartType: "bar",
    chartConfig: { xKey: "alert_level", yKey: "alert_count", label: "Alerts by Severity Level" },
  },
  {
    id: "interest_clusters",
    name: "Interest Clusters",
    description: "What children are interested in, interest groups, trending interests",
    sql: `SELECT interest_cluster, age_group,
      SUM(occurrence_count) as total_occurrences,
      ROUND(AVG(sentiment_affinity)::NUMERIC, 2) as avg_sentiment
      FROM interest_graph
      WHERE interest_cluster IS NOT NULL
      GROUP BY interest_cluster, age_group
      ORDER BY total_occurrences DESC
      LIMIT 20`,
    chartType: "bar",
    chartConfig: { xKey: "interest_cluster", yKey: "total_occurrences", label: "Interest Clusters" },
  },
  {
    id: "session_engagement",
    name: "Session Engagement",
    description: "Session duration, how long users spend, engagement time, pages viewed",
    sql: `SELECT
      COALESCE(source::TEXT, 'unknown') as source,
      COUNT(*) as total_sessions,
      ROUND(AVG(NULLIF(duration_seconds, 0))::NUMERIC, 0) as avg_duration_seconds,
      ROUND(AVG(pages_viewed)::NUMERIC, 1) as avg_pages_viewed,
      ROUND(AVG(events_count)::NUMERIC, 1) as avg_events
      FROM session_tracking
      GROUP BY source
      ORDER BY total_sessions DESC`,
    chartType: "bar",
    chartConfig: { xKey: "source", yKey: "avg_duration_seconds", label: "Session Engagement by Source" },
  },
  {
    id: "message_volume_trend",
    name: "Message Volume Over Time",
    description: "Messages per day, message volume trends, daily messages, messaging activity",
    sql: `SELECT DATE_TRUNC('day', created_at)::DATE as day,
      COUNT(*) as message_count,
      COUNT(DISTINCT sender_id) as unique_senders
      FROM messages
      GROUP BY DATE_TRUNC('day', created_at)
      ORDER BY day DESC
      LIMIT 25`,
    chartType: "line",
    chartConfig: { xKey: "day", yKey: "message_count", label: "Daily Message Volume" },
  },
  {
    id: "waitlist_by_role",
    name: "Waitlist by Role",
    description: "Waitlist breakdown by role, parents vs schools vs churches on waitlist",
    sql: `SELECT role, COUNT(*) as signup_count,
      ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER(), 1) as percentage
      FROM waitlist
      GROUP BY role
      ORDER BY signup_count DESC`,
    chartType: "pie",
    chartConfig: { xKey: "role", yKey: "signup_count", label: "Waitlist by Role" },
  },
  {
    id: "keyword_trends",
    name: "Trending Keywords",
    description: "Trending keywords, popular words, what words are trending, keyword analysis",
    sql: `SELECT keyword, category as topic, age_group,
      SUM(occurrence_count) as total_occurrences
      FROM keyword_trends
      WHERE keyword IS NOT NULL
      GROUP BY keyword, category, age_group
      ORDER BY total_occurrences DESC
      LIMIT 20`,
    chartType: "table",
    chartConfig: { xKey: "keyword", yKey: "total_occurrences", label: "Trending Keywords" },
  },
];

export const TEMPLATE_INDEX = QUERY_TEMPLATES.map(t => `${t.id}: ${t.description}`).join("\n");
