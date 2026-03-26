import { db } from "@workspace/db";
import {
  messageAnalyticsTable, behavioralMetricsTable, networkGraphTable,
  churnPredictionsTable, temporalAnomaliesTable, interestGraphTable,
  messagesTable, usersTable, conversationsTable, sessionTrackingTable,
} from "@workspace/db";
import { eq, desc, sql, gte, lte, and, count } from "drizzle-orm";

export async function computeBehavioralMetrics(userId: number, periodDate: Date) {
  const dayStart = new Date(periodDate);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(periodDate);
  dayEnd.setHours(23, 59, 59, 999);

  const messages = await db
    .select({
      sentimentScore: messageAnalyticsTable.sentimentScore,
      responseTimeSeconds: messageAnalyticsTable.responseTimeSeconds,
      emojiToTextRatio: messageAnalyticsTable.emojiToTextRatio,
      messageLength: messageAnalyticsTable.messageLength,
      wordCount: messageAnalyticsTable.wordCount,
      hasEmoji: messageAnalyticsTable.hasEmoji,
    })
    .from(messageAnalyticsTable)
    .where(and(
      eq(messageAnalyticsTable.senderId, userId),
      gte(messageAnalyticsTable.createdAt, dayStart),
      lte(messageAnalyticsTable.createdAt, dayEnd),
    ));

  if (messages.length === 0) return;

  const sentiments = messages.map(m => m.sentimentScore ?? 0);
  const mean = sentiments.reduce((a, b) => a + b, 0) / sentiments.length;
  const variance = sentiments.reduce((sum, s) => sum + (s - mean) ** 2, 0) / sentiments.length;
  const volatility = Math.sqrt(variance);

  const responseTimes = messages
    .filter(m => m.responseTimeSeconds != null)
    .map(m => m.responseTimeSeconds!);
  const avgResponseLatency = responseTimes.length > 0
    ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
    : null;
  const rtMean = avgResponseLatency ?? 0;
  const rtStddev = responseTimes.length > 1
    ? Math.sqrt(responseTimes.reduce((sum, t) => sum + (t - rtMean) ** 2, 0) / responseTimes.length)
    : null;

  const emojiRatios = messages.map(m => m.emojiToTextRatio ?? 0);
  const avgEmojiRatio = emojiRatios.reduce((a, b) => a + b, 0) / emojiRatios.length;

  const lengths = messages.map(m => m.messageLength ?? m.wordCount ?? 0);
  const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;

  const emojiCount = messages.filter(m => m.hasEmoji).length;
  const textOnlyCount = messages.filter(m => !m.hasEmoji).length;
  const cognitiveFatigue = textOnlyCount > 0 && emojiCount > 0
    ? Math.min(1.0, (emojiCount / messages.length) * (1 - (avgLength / 200)))
    : 0;

  const anxietyScore = Math.min(1.0, (
    (volatility * 0.3) +
    (avgResponseLatency && avgResponseLatency > 300 ? 0.3 : avgResponseLatency && avgResponseLatency > 120 ? 0.15 : 0) +
    (cognitiveFatigue * 0.2) +
    (mean < -0.3 ? 0.2 : 0)
  ));

  const socialAvoidance = responseTimes.length > 0
    ? Math.min(1.0, responseTimes.filter(t => t > 600).length / responseTimes.length)
    : 0;

  await db.execute(sql`
    INSERT INTO behavioral_metrics (user_id, period_date, sentiment_volatility, sentiment_mean, sentiment_min, sentiment_max, avg_response_latency_seconds, response_latency_stddev, emoji_to_text_ratio, avg_message_length, cognitive_fatigue_score, messages_analyzed, anxiety_indicator_score, social_avoidance_score)
    VALUES (${userId}, ${dayStart}, ${volatility}, ${mean}, ${Math.min(...sentiments)}, ${Math.max(...sentiments)}, ${avgResponseLatency}, ${rtStddev}, ${avgEmojiRatio}, ${avgLength}, ${cognitiveFatigue}, ${messages.length}, ${anxietyScore}, ${socialAvoidance})
    ON CONFLICT (user_id, period_date) DO UPDATE SET
      sentiment_volatility = EXCLUDED.sentiment_volatility,
      sentiment_mean = EXCLUDED.sentiment_mean,
      sentiment_min = EXCLUDED.sentiment_min,
      sentiment_max = EXCLUDED.sentiment_max,
      avg_response_latency_seconds = EXCLUDED.avg_response_latency_seconds,
      response_latency_stddev = EXCLUDED.response_latency_stddev,
      emoji_to_text_ratio = EXCLUDED.emoji_to_text_ratio,
      avg_message_length = EXCLUDED.avg_message_length,
      cognitive_fatigue_score = EXCLUDED.cognitive_fatigue_score,
      messages_analyzed = EXCLUDED.messages_analyzed,
      anxiety_indicator_score = EXCLUDED.anxiety_indicator_score,
      social_avoidance_score = EXCLUDED.social_avoidance_score
  `);
}

export async function computeNetworkMetrics(userId: number, periodDate: Date) {
  const days30 = new Date(periodDate.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [sent] = await db
    .select({ count: count() })
    .from(messagesTable)
    .where(and(eq(messagesTable.senderId, userId), gte(messagesTable.createdAt, days30)));

  const conversationIds = await db
    .select({ id: conversationsTable.id })
    .from(conversationsTable)
    .where(eq(conversationsTable.childId, userId));

  let received = 0;
  let uniqueContacts = new Set<number>();
  let repliesTriggered = 0;

  for (const c of conversationIds) {
    const msgs = await db
      .select({ senderId: messagesTable.senderId })
      .from(messagesTable)
      .where(and(eq(messagesTable.conversationId, c.id), gte(messagesTable.createdAt, days30)))
      .orderBy(messagesTable.createdAt);

    for (let i = 0; i < msgs.length; i++) {
      if (msgs[i].senderId !== userId) {
        received++;
        uniqueContacts.add(msgs[i].senderId);
      }
      if (i > 0 && msgs[i].senderId !== userId && msgs[i - 1].senderId === userId) {
        repliesTriggered++;
      }
    }
  }

  const totalSent = sent.count;
  const replyTriggerRate = totalSent > 0 ? repliesTriggered / totalSent : 0;

  const starters = await db
    .select({ count: count() })
    .from(messageAnalyticsTable)
    .where(and(
      eq(messageAnalyticsTable.senderId, userId),
      eq(messageAnalyticsTable.isConversationStarter, true),
      gte(messageAnalyticsTable.createdAt, days30),
    ));

  const initiationRate = totalSent > 0 ? starters[0].count / totalSent : 0;
  const reciprocity = totalSent + received > 0
    ? 1 - Math.abs(totalSent - received) / (totalSent + received)
    : 0;

  const influenceScore = (replyTriggerRate * 0.4) + (initiationRate * 0.3) + (Math.min(uniqueContacts.size / 10, 1) * 0.3);

  let networkRole = "participant";
  if (initiationRate > 0.5 && replyTriggerRate > 0.5) networkRole = "leader";
  else if (initiationRate > 0.5) networkRole = "initiator";
  else if (replyTriggerRate > 0.5) networkRole = "influencer";
  else if (totalSent < 3 && received > totalSent * 2) networkRole = "observer";

  const pd = new Date(periodDate);
  pd.setHours(0, 0, 0, 0);
  await db.execute(sql`
    INSERT INTO network_graph (user_id, period_date, influence_score, reply_trigger_rate, downstream_actions, unique_connections, messages_sent, messages_received, initiation_rate, reciprocity_score, network_role)
    VALUES (${userId}, ${pd}, ${influenceScore}, ${replyTriggerRate}, ${repliesTriggered}, ${uniqueContacts.size}, ${totalSent}, ${received}, ${initiationRate}, ${reciprocity}, ${networkRole})
    ON CONFLICT (user_id, period_date) DO UPDATE SET
      influence_score = EXCLUDED.influence_score,
      reply_trigger_rate = EXCLUDED.reply_trigger_rate,
      downstream_actions = EXCLUDED.downstream_actions,
      unique_connections = EXCLUDED.unique_connections,
      messages_sent = EXCLUDED.messages_sent,
      messages_received = EXCLUDED.messages_received,
      initiation_rate = EXCLUDED.initiation_rate,
      reciprocity_score = EXCLUDED.reciprocity_score,
      network_role = EXCLUDED.network_role
  `);
}

export async function computeChurnPrediction(userId: number) {
  const now = new Date();
  const days14 = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const days7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const days30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const recentMsgs = await db
    .select({
      wordCount: messageAnalyticsTable.wordCount,
      messageLength: messageAnalyticsTable.messageLength,
      responseTimeSeconds: messageAnalyticsTable.responseTimeSeconds,
      createdAt: messageAnalyticsTable.createdAt,
    })
    .from(messageAnalyticsTable)
    .where(and(eq(messageAnalyticsTable.senderId, userId), gte(messageAnalyticsTable.createdAt, days30)))
    .orderBy(messageAnalyticsTable.createdAt);

  if (recentMsgs.length < 3) return;

  const half = Math.floor(recentMsgs.length / 2);
  const firstHalf = recentMsgs.slice(0, half);
  const secondHalf = recentMsgs.slice(half);

  const avgLen = (msgs: typeof recentMsgs) =>
    msgs.reduce((s, m) => s + (m.messageLength ?? m.wordCount ?? 0), 0) / msgs.length;
  const avgRt = (msgs: typeof recentMsgs) => {
    const rts = msgs.filter(m => m.responseTimeSeconds != null).map(m => m.responseTimeSeconds!);
    return rts.length > 0 ? rts.reduce((a, b) => a + b, 0) / rts.length : 0;
  };

  const lenGradient = avgLen(firstHalf) > 0 ? (avgLen(secondHalf) - avgLen(firstHalf)) / avgLen(firstHalf) : 0;
  const rtGradient = avgRt(firstHalf) > 0 ? (avgRt(secondHalf) - avgRt(firstHalf)) / avgRt(firstHalf) : 0;

  const [recentSessions] = await db
    .select({ count: count() })
    .from(sessionTrackingTable)
    .where(and(eq(sessionTrackingTable.userId, userId), gte(sessionTrackingTable.startedAt, days7)));
  const [olderSessions] = await db
    .select({ count: count() })
    .from(sessionTrackingTable)
    .where(and(
      eq(sessionTrackingTable.userId, userId),
      gte(sessionTrackingTable.startedAt, days14),
    ));

  const sessionGradient = olderSessions.count > 0
    ? (recentSessions.count - (olderSessions.count - recentSessions.count)) / Math.max(olderSessions.count, 1)
    : 0;

  const lastMsg = recentMsgs[recentMsgs.length - 1];
  const daysInactive = Math.floor((now.getTime() - lastMsg.createdAt.getTime()) / (24 * 60 * 60 * 1000));

  const silenceGradient = daysInactive / 14;

  const churnRisk = Math.min(1.0, Math.max(0, (
    (lenGradient < -0.2 ? Math.abs(lenGradient) * 0.25 : 0) +
    (rtGradient > 0.3 ? Math.min(rtGradient * 0.2, 0.25) : 0) +
    (silenceGradient * 0.3) +
    (sessionGradient < -0.3 ? Math.abs(sessionGradient) * 0.2 : 0)
  )));

  const riskFactors: string[] = [];
  if (lenGradient < -0.2) riskFactors.push("shrinking_message_length");
  if (rtGradient > 0.3) riskFactors.push("increasing_response_time");
  if (silenceGradient > 0.5) riskFactors.push("extended_silence");
  if (sessionGradient < -0.3) riskFactors.push("declining_sessions");

  const predictedDays = churnRisk > 0.1 ? Math.max(1, Math.round(14 * (1 - churnRisk))) : null;

  const confidence = Math.min(1.0, recentMsgs.length / 20);
  const predictedChurnDate = predictedDays ? new Date(now.getTime() + predictedDays * 24 * 60 * 60 * 1000) : null;
  await db.execute(sql`
    INSERT INTO churn_predictions (user_id, churn_risk_score, predicted_churn_date, confidence_level, silence_gradient, message_length_gradient, response_time_gradient, session_frequency_gradient, days_inactive, last_active_at, risk_factors)
    VALUES (${userId}, ${churnRisk}, ${predictedChurnDate}, ${confidence}, ${silenceGradient}, ${lenGradient}, ${rtGradient}, ${sessionGradient}, ${daysInactive}, ${lastMsg.createdAt}, ${JSON.stringify(riskFactors)}::jsonb)
    ON CONFLICT (user_id) DO UPDATE SET
      churn_risk_score = EXCLUDED.churn_risk_score,
      predicted_churn_date = EXCLUDED.predicted_churn_date,
      confidence_level = EXCLUDED.confidence_level,
      silence_gradient = EXCLUDED.silence_gradient,
      message_length_gradient = EXCLUDED.message_length_gradient,
      response_time_gradient = EXCLUDED.response_time_gradient,
      session_frequency_gradient = EXCLUDED.session_frequency_gradient,
      days_inactive = EXCLUDED.days_inactive,
      last_active_at = EXCLUDED.last_active_at,
      risk_factors = EXCLUDED.risk_factors,
      computed_at = NOW()
  `);
}

export async function runAllComputations() {
  const today = new Date();
  const children = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.role, "child"));

  for (const child of children) {
    try {
      await computeBehavioralMetrics(child.id, today);
    } catch (e) {
      console.error(`Behavioral metrics failed for user ${child.id}:`, e);
    }
    try {
      await computeNetworkMetrics(child.id, today);
    } catch (e) {
      console.error(`Network metrics failed for user ${child.id}:`, e);
    }
    try {
      await computeChurnPrediction(child.id);
    } catch (e) {
      console.error(`Churn prediction failed for user ${child.id}:`, e);
    }
  }
}
