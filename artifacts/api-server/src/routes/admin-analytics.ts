import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { db } from "@workspace/db";
import {
  usersTable, messagesTable, alertsTable, conversationsTable, contactsTable,
  analyticsEventsTable, sessionTrackingTable, messageAnalyticsTable,
  conversationInsightsTable, keywordTrendsTable, safetyAnalyticsTable,
  demographicSnapshotsTable,
} from "@workspace/db";
import { eq, desc, sql, gte, lte, and, count } from "drizzle-orm";
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

router.get("/admin/analytics/overview", async (req, res) => {
  try {
    const now = new Date();
    const days7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const days30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const days1 = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const [totalUsers] = await db.select({ count: count() }).from(usersTable);
    const [totalParents] = await db.select({ count: count() }).from(usersTable).where(eq(usersTable.role, "parent"));
    const [totalChildren] = await db.select({ count: count() }).from(usersTable).where(eq(usersTable.role, "child"));
    const [totalMessages] = await db.select({ count: count() }).from(messagesTable);
    const [totalConversations] = await db.select({ count: count() }).from(conversationsTable);
    const [totalAlerts] = await db.select({ count: count() }).from(alertsTable);
    const [totalContacts] = await db.select({ count: count() }).from(contactsTable);

    const [messages24h] = await db.select({ count: count() }).from(messagesTable).where(gte(messagesTable.createdAt, days1));
    const [messages7d] = await db.select({ count: count() }).from(messagesTable).where(gte(messagesTable.createdAt, days7));
    const [messages30d] = await db.select({ count: count() }).from(messagesTable).where(gte(messagesTable.createdAt, days30));

    const [alerts7d] = await db.select({ count: count() }).from(alertsTable).where(gte(alertsTable.createdAt, days7));
    const [newUsers7d] = await db.select({ count: count() }).from(usersTable).where(gte(usersTable.createdAt, days7));

    const [blockedMessages] = await db.select({ count: count() }).from(messagesTable).where(eq(messagesTable.isBlocked, true));

    const [faithUsers] = await db.select({ count: count() }).from(usersTable).where(eq(usersTable.faithModeEnabled, true));

    const messageTrend = await db
      .select({
        day: sql<string>`DATE(${messagesTable.createdAt})`,
        count: count(),
      })
      .from(messagesTable)
      .where(gte(messagesTable.createdAt, days30))
      .groupBy(sql`DATE(${messagesTable.createdAt})`)
      .orderBy(sql`DATE(${messagesTable.createdAt})`);

    const alertTrend = await db
      .select({
        day: sql<string>`DATE(${alertsTable.createdAt})`,
        count: count(),
      })
      .from(alertsTable)
      .where(gte(alertsTable.createdAt, days30))
      .groupBy(sql`DATE(${alertsTable.createdAt})`)
      .orderBy(sql`DATE(${alertsTable.createdAt})`);

    const userGrowth = await db
      .select({
        day: sql<string>`DATE(${usersTable.createdAt})`,
        count: count(),
      })
      .from(usersTable)
      .where(gte(usersTable.createdAt, days30))
      .groupBy(sql`DATE(${usersTable.createdAt})`)
      .orderBy(sql`DATE(${usersTable.createdAt})`);

    res.json({
      kpis: {
        totalUsers: totalUsers.count,
        totalParents: totalParents.count,
        totalChildren: totalChildren.count,
        totalMessages: totalMessages.count,
        totalConversations: totalConversations.count,
        totalAlerts: totalAlerts.count,
        totalContacts: totalContacts.count,
        messages24h: messages24h.count,
        messages7d: messages7d.count,
        messages30d: messages30d.count,
        alerts7d: alerts7d.count,
        newUsers7d: newUsers7d.count,
        blockedMessages: blockedMessages.count,
        faithModeUsers: faithUsers.count,
        flagRate: totalMessages.count > 0
          ? ((totalAlerts.count / totalMessages.count) * 100).toFixed(2) + "%"
          : "0%",
        blockRate: totalMessages.count > 0
          ? ((blockedMessages.count / totalMessages.count) * 100).toFixed(2) + "%"
          : "0%",
      },
      trends: { messageTrend, alertTrend, userGrowth },
    });
  } catch (error) {
    req.log.error(error, "Failed to get analytics overview");
    res.status(500).json({ error: "Failed to get overview" });
  }
});

router.get("/admin/analytics/conversations", async (req, res) => {
  try {
    const days30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const topicDistribution = await db
      .select({
        topic: messageAnalyticsTable.topicCategory,
        count: count(),
      })
      .from(messageAnalyticsTable)
      .where(gte(messageAnalyticsTable.createdAt, days30))
      .groupBy(messageAnalyticsTable.topicCategory)
      .orderBy(desc(count()));

    const sentimentOverTime = await db
      .select({
        day: sql<string>`DATE(${messageAnalyticsTable.createdAt})`,
        avgSentiment: sql<number>`AVG(${messageAnalyticsTable.sentimentScore})`,
        count: count(),
      })
      .from(messageAnalyticsTable)
      .where(gte(messageAnalyticsTable.createdAt, days30))
      .groupBy(sql`DATE(${messageAnalyticsTable.createdAt})`)
      .orderBy(sql`DATE(${messageAnalyticsTable.createdAt})`);

    const emotionalToneDistribution = await db
      .select({
        tone: messageAnalyticsTable.emotionalTone,
        count: count(),
      })
      .from(messageAnalyticsTable)
      .where(gte(messageAnalyticsTable.createdAt, days30))
      .groupBy(messageAnalyticsTable.emotionalTone)
      .orderBy(desc(count()));

    const vocabularyByAge = await db
      .select({
        ageGroup: messageAnalyticsTable.senderAgeGroup,
        avgComplexity: sql<number>`AVG(${messageAnalyticsTable.vocabularyComplexity})`,
        avgWordCount: sql<number>`AVG(${messageAnalyticsTable.wordCount})`,
        count: count(),
      })
      .from(messageAnalyticsTable)
      .where(gte(messageAnalyticsTable.createdAt, days30))
      .groupBy(messageAnalyticsTable.senderAgeGroup)
      .orderBy(messageAnalyticsTable.senderAgeGroup);

    const avgMetrics = await db
      .select({
        avgWordCount: sql<number>`AVG(${messageAnalyticsTable.wordCount})`,
        avgSentenceCount: sql<number>`AVG(${messageAnalyticsTable.sentenceCount})`,
        avgComplexity: sql<number>`AVG(${messageAnalyticsTable.vocabularyComplexity})`,
        avgSentiment: sql<number>`AVG(${messageAnalyticsTable.sentimentScore})`,
        avgResponseTime: sql<number>`AVG(${messageAnalyticsTable.responseTimeSeconds})`,
        emojiRate: sql<number>`AVG(CASE WHEN ${messageAnalyticsTable.hasEmoji} THEN 1 ELSE 0 END)`,
        slangRate: sql<number>`AVG(CASE WHEN ${messageAnalyticsTable.hasSlang} THEN 1 ELSE 0 END)`,
      })
      .from(messageAnalyticsTable)
      .where(gte(messageAnalyticsTable.createdAt, days30));

    const conversationStarters = await db
      .select({ count: count() })
      .from(messageAnalyticsTable)
      .where(and(
        gte(messageAnalyticsTable.createdAt, days30),
        eq(messageAnalyticsTable.isConversationStarter, true),
      ));

    const topicByAge = await db
      .select({
        ageGroup: messageAnalyticsTable.senderAgeGroup,
        topic: messageAnalyticsTable.topicCategory,
        count: count(),
      })
      .from(messageAnalyticsTable)
      .where(gte(messageAnalyticsTable.createdAt, days30))
      .groupBy(messageAnalyticsTable.senderAgeGroup, messageAnalyticsTable.topicCategory)
      .orderBy(messageAnalyticsTable.senderAgeGroup, desc(count()));

    const sentimentByTopic = await db
      .select({
        topic: messageAnalyticsTable.topicCategory,
        avgSentiment: sql<number>`AVG(${messageAnalyticsTable.sentimentScore})`,
        count: count(),
      })
      .from(messageAnalyticsTable)
      .where(gte(messageAnalyticsTable.createdAt, days30))
      .groupBy(messageAnalyticsTable.topicCategory)
      .orderBy(desc(count()));

    res.json({
      topicDistribution,
      sentimentOverTime,
      emotionalToneDistribution,
      vocabularyByAge,
      averages: avgMetrics[0] ?? {},
      conversationStarters: conversationStarters[0]?.count ?? 0,
      topicByAge,
      sentimentByTopic,
    });
  } catch (error) {
    req.log.error(error, "Failed to get conversation analytics");
    res.status(500).json({ error: "Failed to get conversation analytics" });
  }
});

router.get("/admin/analytics/safety", async (req, res) => {
  try {
    const days30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const days7 = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const alertsByLevel = await db
      .select({
        level: alertsTable.alertLevel,
        count: count(),
      })
      .from(alertsTable)
      .where(gte(alertsTable.createdAt, days30))
      .groupBy(alertsTable.alertLevel);

    const alertsTrend = await db
      .select({
        day: sql<string>`DATE(${alertsTable.createdAt})`,
        count: count(),
      })
      .from(alertsTable)
      .where(gte(alertsTable.createdAt, days30))
      .groupBy(sql`DATE(${alertsTable.createdAt})`)
      .orderBy(sql`DATE(${alertsTable.createdAt})`);

    const [blockedMessages] = await db
      .select({ count: count() })
      .from(messagesTable)
      .where(and(
        eq(messagesTable.isBlocked, true),
        gte(messagesTable.createdAt, days30),
      ));

    const [totalMessages30d] = await db
      .select({ count: count() })
      .from(messagesTable)
      .where(gte(messagesTable.createdAt, days30));

    const [readAlerts] = await db
      .select({ count: count() })
      .from(alertsTable)
      .where(and(
        eq(alertsTable.isRead, true),
        gte(alertsTable.createdAt, days30),
      ));

    const [totalAlerts30d] = await db
      .select({ count: count() })
      .from(alertsTable)
      .where(gte(alertsTable.createdAt, days30));

    const flaggedByChild = await db
      .select({
        childId: alertsTable.childId,
        count: count(),
      })
      .from(alertsTable)
      .where(gte(alertsTable.createdAt, days30))
      .groupBy(alertsTable.childId)
      .orderBy(desc(count()))
      .limit(10);

    const flaggedChildrenWithAge = await Promise.all(
      flaggedByChild.map(async (fc) => {
        const [child] = await db.select({
          age: usersTable.age,
          grade: usersTable.grade,
          faithMode: usersTable.faithModeEnabled,
        }).from(usersTable).where(eq(usersTable.id, fc.childId));
        return {
          childId: fc.childId,
          count: fc.count,
          ageGroup: child?.age
            ? child.age <= 8 ? "6-8" : child.age <= 11 ? "9-11" : child.age <= 14 ? "12-14" : "15-17"
            : "unknown",
          grade: child?.grade ?? "unknown",
          faithMode: child?.faithMode ?? false,
        };
      })
    );

    const hourlyDistribution = await db
      .select({
        hour: sql<number>`EXTRACT(HOUR FROM ${alertsTable.createdAt})`,
        count: count(),
      })
      .from(alertsTable)
      .where(gte(alertsTable.createdAt, days30))
      .groupBy(sql`EXTRACT(HOUR FROM ${alertsTable.createdAt})`)
      .orderBy(sql`EXTRACT(HOUR FROM ${alertsTable.createdAt})`);

    res.json({
      alertsByLevel,
      alertsTrend,
      blockedMessages: blockedMessages.count,
      totalMessages: totalMessages30d.count,
      blockRate: totalMessages30d.count > 0
        ? ((blockedMessages.count / totalMessages30d.count) * 100).toFixed(2)
        : "0",
      alertReviewRate: totalAlerts30d.count > 0
        ? ((readAlerts.count / totalAlerts30d.count) * 100).toFixed(2)
        : "0",
      topFlaggedChildren: flaggedChildrenWithAge,
      hourlyDistribution,
    });
  } catch (error) {
    req.log.error(error, "Failed to get safety analytics");
    res.status(500).json({ error: "Failed to get safety analytics" });
  }
});

router.get("/admin/analytics/demographics", async (req, res) => {
  try {
    const ageDistribution = await db
      .select({
        age: usersTable.age,
        count: count(),
      })
      .from(usersTable)
      .where(eq(usersTable.role, "child"))
      .groupBy(usersTable.age)
      .orderBy(usersTable.age);

    const gradeDistribution = await db
      .select({
        grade: usersTable.grade,
        count: count(),
      })
      .from(usersTable)
      .where(eq(usersTable.role, "child"))
      .groupBy(usersTable.grade)
      .orderBy(usersTable.grade);

    const trustLevelDistribution = await db
      .select({
        level: usersTable.trustLevel,
        count: count(),
      })
      .from(usersTable)
      .where(eq(usersTable.role, "child"))
      .groupBy(usersTable.trustLevel)
      .orderBy(usersTable.trustLevel);

    const [faithModeStats] = await db
      .select({
        enabled: count(sql`CASE WHEN ${usersTable.faithModeEnabled} = true THEN 1 END`),
        total: count(),
      })
      .from(usersTable)
      .where(eq(usersTable.role, "child"));

    const familySizes = await db
      .select({
        parentId: usersTable.parentId,
        childCount: count(),
      })
      .from(usersTable)
      .where(eq(usersTable.role, "child"))
      .groupBy(usersTable.parentId);

    const sizeDistribution: Record<string, number> = {};
    for (const f of familySizes) {
      const key = f.childCount >= 4 ? "4+" : String(f.childCount);
      sizeDistribution[key] = (sizeDistribution[key] ?? 0) + 1;
    }

    const pausedAccounts = await db
      .select({ count: count() })
      .from(usersTable)
      .where(eq(usersTable.isPaused, true));

    res.json({
      ageDistribution,
      gradeDistribution,
      trustLevelDistribution,
      faithMode: {
        enabled: faithModeStats?.enabled ?? 0,
        total: faithModeStats?.total ?? 0,
        adoptionRate: faithModeStats?.total
          ? ((Number(faithModeStats.enabled) / Number(faithModeStats.total)) * 100).toFixed(1)
          : "0",
      },
      familySizeDistribution: sizeDistribution,
      avgChildrenPerFamily: familySizes.length > 0
        ? (familySizes.reduce((s, f) => s + Number(f.childCount), 0) / familySizes.length).toFixed(1)
        : "0",
      pausedAccounts: pausedAccounts[0]?.count ?? 0,
    });
  } catch (error) {
    req.log.error(error, "Failed to get demographics");
    res.status(500).json({ error: "Failed to get demographics" });
  }
});

router.get("/admin/analytics/engagement", async (req, res) => {
  try {
    const days30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const days7 = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const sessionStats = await db
      .select({
        avgDuration: sql<number>`AVG(${sessionTrackingTable.durationSeconds})`,
        avgPages: sql<number>`AVG(${sessionTrackingTable.pagesViewed})`,
        avgEvents: sql<number>`AVG(${sessionTrackingTable.eventsCount})`,
        totalSessions: count(),
      })
      .from(sessionTrackingTable)
      .where(gte(sessionTrackingTable.startedAt, days30));

    const sessionsBySource = await db
      .select({
        source: sessionTrackingTable.source,
        count: count(),
        avgDuration: sql<number>`AVG(${sessionTrackingTable.durationSeconds})`,
      })
      .from(sessionTrackingTable)
      .where(gte(sessionTrackingTable.startedAt, days30))
      .groupBy(sessionTrackingTable.source);

    const sessionsByDevice = await db
      .select({
        device: sessionTrackingTable.deviceType,
        count: count(),
      })
      .from(sessionTrackingTable)
      .where(gte(sessionTrackingTable.startedAt, days30))
      .groupBy(sessionTrackingTable.deviceType)
      .orderBy(desc(count()));

    const dailySessions = await db
      .select({
        day: sql<string>`DATE(${sessionTrackingTable.startedAt})`,
        count: count(),
      })
      .from(sessionTrackingTable)
      .where(gte(sessionTrackingTable.startedAt, days30))
      .groupBy(sql`DATE(${sessionTrackingTable.startedAt})`)
      .orderBy(sql`DATE(${sessionTrackingTable.startedAt})`);

    const messagingPatterns = await db
      .select({
        hour: sql<number>`EXTRACT(HOUR FROM ${messagesTable.createdAt})`,
        count: count(),
      })
      .from(messagesTable)
      .where(gte(messagesTable.createdAt, days30))
      .groupBy(sql`EXTRACT(HOUR FROM ${messagesTable.createdAt})`)
      .orderBy(sql`EXTRACT(HOUR FROM ${messagesTable.createdAt})`);

    const dayOfWeekPattern = await db
      .select({
        dow: sql<number>`EXTRACT(DOW FROM ${messagesTable.createdAt})`,
        count: count(),
      })
      .from(messagesTable)
      .where(gte(messagesTable.createdAt, days30))
      .groupBy(sql`EXTRACT(DOW FROM ${messagesTable.createdAt})`)
      .orderBy(sql`EXTRACT(DOW FROM ${messagesTable.createdAt})`);

    const topEvents = await db
      .select({
        eventName: analyticsEventsTable.eventName,
        count: count(),
      })
      .from(analyticsEventsTable)
      .where(gte(analyticsEventsTable.createdAt, days30))
      .groupBy(analyticsEventsTable.eventName)
      .orderBy(desc(count()))
      .limit(20);

    res.json({
      sessions: sessionStats[0] ?? {},
      sessionsBySource,
      sessionsByDevice,
      dailySessions,
      messagingPatterns,
      dayOfWeekPattern,
      topEvents,
    });
  } catch (error) {
    req.log.error(error, "Failed to get engagement analytics");
    res.status(500).json({ error: "Failed to get engagement analytics" });
  }
});

router.get("/admin/analytics/content", async (req, res) => {
  try {
    const days30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const recentKeywords = await db
      .select()
      .from(keywordTrendsTable)
      .where(gte(keywordTrendsTable.periodStart, days30))
      .orderBy(desc(keywordTrendsTable.occurrenceCount))
      .limit(50);

    const topicTrend = await db
      .select({
        day: sql<string>`DATE(${messageAnalyticsTable.createdAt})`,
        topic: messageAnalyticsTable.topicCategory,
        count: count(),
      })
      .from(messageAnalyticsTable)
      .where(gte(messageAnalyticsTable.createdAt, days30))
      .groupBy(sql`DATE(${messageAnalyticsTable.createdAt})`, messageAnalyticsTable.topicCategory)
      .orderBy(sql`DATE(${messageAnalyticsTable.createdAt})`);

    const sentimentByAge = await db
      .select({
        ageGroup: messageAnalyticsTable.senderAgeGroup,
        sentimentLabel: messageAnalyticsTable.sentimentLabel,
        count: count(),
      })
      .from(messageAnalyticsTable)
      .where(gte(messageAnalyticsTable.createdAt, days30))
      .groupBy(messageAnalyticsTable.senderAgeGroup, messageAnalyticsTable.sentimentLabel)
      .orderBy(messageAnalyticsTable.senderAgeGroup);

    const communicationComplexity = await db
      .select({
        day: sql<string>`DATE(${messageAnalyticsTable.createdAt})`,
        avgWordCount: sql<number>`AVG(${messageAnalyticsTable.wordCount})`,
        avgComplexity: sql<number>`AVG(${messageAnalyticsTable.vocabularyComplexity})`,
        avgSentences: sql<number>`AVG(${messageAnalyticsTable.sentenceCount})`,
      })
      .from(messageAnalyticsTable)
      .where(gte(messageAnalyticsTable.createdAt, days30))
      .groupBy(sql`DATE(${messageAnalyticsTable.createdAt})`)
      .orderBy(sql`DATE(${messageAnalyticsTable.createdAt})`);

    const emojiSlangUsage = await db
      .select({
        ageGroup: messageAnalyticsTable.senderAgeGroup,
        emojiRate: sql<number>`AVG(CASE WHEN ${messageAnalyticsTable.hasEmoji} THEN 1.0 ELSE 0.0 END)`,
        slangRate: sql<number>`AVG(CASE WHEN ${messageAnalyticsTable.hasSlang} THEN 1.0 ELSE 0.0 END)`,
        count: count(),
      })
      .from(messageAnalyticsTable)
      .where(gte(messageAnalyticsTable.createdAt, days30))
      .groupBy(messageAnalyticsTable.senderAgeGroup);

    res.json({
      keywords: recentKeywords,
      topicTrend,
      sentimentByAge,
      communicationComplexity,
      emojiSlangUsage,
    });
  } catch (error) {
    req.log.error(error, "Failed to get content analytics");
    res.status(500).json({ error: "Failed to get content analytics" });
  }
});

router.get("/admin/analytics/website", async (req, res) => {
  try {
    const days30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const pageViews = await db
      .select({
        page: analyticsEventsTable.pageUrl,
        count: count(),
      })
      .from(analyticsEventsTable)
      .where(and(
        eq(analyticsEventsTable.source, "web"),
        eq(analyticsEventsTable.eventName, "page_view"),
        gte(analyticsEventsTable.createdAt, days30),
      ))
      .groupBy(analyticsEventsTable.pageUrl)
      .orderBy(desc(count()));

    const dailyTraffic = await db
      .select({
        day: sql<string>`DATE(${analyticsEventsTable.createdAt})`,
        count: count(),
        uniqueVisitors: sql<number>`COUNT(DISTINCT ${analyticsEventsTable.ipHash})`,
      })
      .from(analyticsEventsTable)
      .where(and(
        eq(analyticsEventsTable.source, "web"),
        gte(analyticsEventsTable.createdAt, days30),
      ))
      .groupBy(sql`DATE(${analyticsEventsTable.createdAt})`)
      .orderBy(sql`DATE(${analyticsEventsTable.createdAt})`);

    const waitlistConversions = await db
      .select({
        day: sql<string>`DATE(${analyticsEventsTable.createdAt})`,
        count: count(),
      })
      .from(analyticsEventsTable)
      .where(and(
        eq(analyticsEventsTable.source, "web"),
        eq(analyticsEventsTable.eventName, "waitlist_signup"),
        gte(analyticsEventsTable.createdAt, days30),
      ))
      .groupBy(sql`DATE(${analyticsEventsTable.createdAt})`)
      .orderBy(sql`DATE(${analyticsEventsTable.createdAt})`);

    const referrers = await db
      .select({
        referrer: analyticsEventsTable.referrer,
        count: count(),
      })
      .from(analyticsEventsTable)
      .where(and(
        eq(analyticsEventsTable.source, "web"),
        gte(analyticsEventsTable.createdAt, days30),
      ))
      .groupBy(analyticsEventsTable.referrer)
      .orderBy(desc(count()))
      .limit(20);

    const webSessions = await db
      .select({
        avgDuration: sql<number>`AVG(${sessionTrackingTable.durationSeconds})`,
        avgPages: sql<number>`AVG(${sessionTrackingTable.pagesViewed})`,
        totalSessions: count(),
      })
      .from(sessionTrackingTable)
      .where(and(
        eq(sessionTrackingTable.source, "web"),
        gte(sessionTrackingTable.startedAt, days30),
      ));

    res.json({
      pageViews,
      dailyTraffic,
      waitlistConversions,
      referrers,
      webSessions: webSessions[0] ?? {},
    });
  } catch (error) {
    req.log.error(error, "Failed to get website analytics");
    res.status(500).json({ error: "Failed to get website analytics" });
  }
});

export default router;
