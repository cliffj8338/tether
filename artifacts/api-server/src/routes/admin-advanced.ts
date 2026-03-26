import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { db } from "@workspace/db";
import {
  behavioralMetricsTable, networkGraphTable, churnPredictionsTable,
  temporalAnomaliesTable, interestGraphTable, messageAnalyticsTable,
  usersTable, messagesTable,
} from "@workspace/db";
import { eq, desc, sql, gte, and, count } from "drizzle-orm";
import { getUserFromToken } from "../lib/auth";
import { runAllComputations } from "../lib/behavioral-engine";

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

router.post("/admin/analytics/compute", async (req, res) => {
  try {
    await runAllComputations();
    res.json({ ok: true, message: "Computations completed" });
  } catch (error) {
    req.log.error(error, "Failed to run computations");
    res.status(500).json({ error: "Computation failed" });
  }
});

router.get("/admin/analytics/behavioral", async (req, res) => {
  try {
    const days30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const volatilityTrend = await db
      .select({
        date: sql<string>`DATE(${behavioralMetricsTable.periodDate})`,
        avgVolatility: sql<number>`AVG(${behavioralMetricsTable.sentimentVolatility})`,
        avgAnxiety: sql<number>`AVG(${behavioralMetricsTable.anxietyIndicatorScore})`,
        avgFatigue: sql<number>`AVG(${behavioralMetricsTable.cognitiveFatigueScore})`,
        usersAnalyzed: sql<number>`COUNT(DISTINCT ${behavioralMetricsTable.userId})`,
      })
      .from(behavioralMetricsTable)
      .where(gte(behavioralMetricsTable.periodDate, days30))
      .groupBy(sql`DATE(${behavioralMetricsTable.periodDate})`)
      .orderBy(sql`DATE(${behavioralMetricsTable.periodDate})`);

    const latestMetrics = await db
      .select()
      .from(behavioralMetricsTable)
      .orderBy(desc(behavioralMetricsTable.periodDate))
      .limit(50);

    const avgMetrics = await db
      .select({
        avgVolatility: sql<number>`AVG(${behavioralMetricsTable.sentimentVolatility})`,
        avgAnxiety: sql<number>`AVG(${behavioralMetricsTable.anxietyIndicatorScore})`,
        avgFatigue: sql<number>`AVG(${behavioralMetricsTable.cognitiveFatigueScore})`,
        avgSocialAvoidance: sql<number>`AVG(${behavioralMetricsTable.socialAvoidanceScore})`,
        avgResponseLatency: sql<number>`AVG(${behavioralMetricsTable.avgResponseLatencySeconds})`,
        avgEmojiRatio: sql<number>`AVG(${behavioralMetricsTable.emojiToTextRatio})`,
      })
      .from(behavioralMetricsTable)
      .where(gte(behavioralMetricsTable.periodDate, days30));

    const responseLantencyByUser = await db
      .select({
        userId: behavioralMetricsTable.userId,
        avgLatency: sql<number>`AVG(${behavioralMetricsTable.avgResponseLatencySeconds})`,
        avgAnxiety: sql<number>`AVG(${behavioralMetricsTable.anxietyIndicatorScore})`,
      })
      .from(behavioralMetricsTable)
      .where(gte(behavioralMetricsTable.periodDate, days30))
      .groupBy(behavioralMetricsTable.userId)
      .orderBy(desc(sql`AVG(${behavioralMetricsTable.anxietyIndicatorScore})`))
      .limit(20);

    const emojiTrend = await db
      .select({
        date: sql<string>`DATE(${behavioralMetricsTable.periodDate})`,
        avgEmojiRatio: sql<number>`AVG(${behavioralMetricsTable.emojiToTextRatio})`,
        avgMsgLength: sql<number>`AVG(${behavioralMetricsTable.avgMessageLength})`,
      })
      .from(behavioralMetricsTable)
      .where(gte(behavioralMetricsTable.periodDate, days30))
      .groupBy(sql`DATE(${behavioralMetricsTable.periodDate})`)
      .orderBy(sql`DATE(${behavioralMetricsTable.periodDate})`);

    res.json({
      kpis: avgMetrics[0] ?? {},
      volatilityTrend,
      emojiTrend,
      latestMetrics: latestMetrics.map(m => ({
        userId: m.userId,
        date: m.periodDate,
        volatility: m.sentimentVolatility,
        anxiety: m.anxietyIndicatorScore,
        fatigue: m.cognitiveFatigueScore,
        socialAvoidance: m.socialAvoidanceScore,
        responseLatency: m.avgResponseLatencySeconds,
        emojiRatio: m.emojiToTextRatio,
      })),
      anxietyLeaderboard: responseLantencyByUser,
    });
  } catch (error) {
    req.log.error(error, "Failed to get behavioral analytics");
    res.status(500).json({ error: "Failed to get behavioral analytics" });
  }
});

router.get("/admin/analytics/network", async (req, res) => {
  try {
    const days30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const networkNodes = await db
      .select()
      .from(networkGraphTable)
      .where(gte(networkGraphTable.periodDate, days30))
      .orderBy(desc(networkGraphTable.influenceScore))
      .limit(50);

    const roleDistribution = await db
      .select({
        role: networkGraphTable.networkRole,
        count: count(),
      })
      .from(networkGraphTable)
      .where(gte(networkGraphTable.periodDate, days30))
      .groupBy(networkGraphTable.networkRole);

    const avgNetworkMetrics = await db
      .select({
        avgInfluence: sql<number>`AVG(${networkGraphTable.influenceScore})`,
        avgReciprocity: sql<number>`AVG(${networkGraphTable.reciprocityScore})`,
        avgConnections: sql<number>`AVG(${networkGraphTable.uniqueConnections})`,
        avgInitiation: sql<number>`AVG(${networkGraphTable.initiationRate})`,
        avgReplyTrigger: sql<number>`AVG(${networkGraphTable.replyTriggerRate})`,
      })
      .from(networkGraphTable)
      .where(gte(networkGraphTable.periodDate, days30));

    const totalConnections = networkNodes.reduce((s, n) => s + (n.uniqueConnections ?? 0), 0);
    const totalUsers = new Set(networkNodes.map(n => n.userId)).size;
    const graphDensity = totalUsers > 1
      ? totalConnections / (totalUsers * (totalUsers - 1))
      : 0;

    const topInfluencers = networkNodes
      .sort((a, b) => (b.influenceScore ?? 0) - (a.influenceScore ?? 0))
      .slice(0, 10)
      .map(n => ({
        userId: n.userId,
        influenceScore: n.influenceScore,
        replyTriggerRate: n.replyTriggerRate,
        role: n.networkRole,
        connections: n.uniqueConnections,
      }));

    res.json({
      kpis: {
        ...avgNetworkMetrics[0],
        graphDensity,
        totalNodes: totalUsers,
      },
      roleDistribution,
      topInfluencers,
      networkTopology: graphDensity > 0.5 ? "mesh" : graphDensity > 0.2 ? "cluster" : "star",
    });
  } catch (error) {
    req.log.error(error, "Failed to get network analytics");
    res.status(500).json({ error: "Failed to get network analytics" });
  }
});

router.get("/admin/analytics/predictions", async (req, res) => {
  try {
    const churnRisks = await db
      .select()
      .from(churnPredictionsTable)
      .orderBy(desc(churnPredictionsTable.churnRiskScore))
      .limit(50);

    const riskDistribution = {
      high: churnRisks.filter(c => (c.churnRiskScore ?? 0) > 0.7).length,
      medium: churnRisks.filter(c => (c.churnRiskScore ?? 0) > 0.3 && (c.churnRiskScore ?? 0) <= 0.7).length,
      low: churnRisks.filter(c => (c.churnRiskScore ?? 0) <= 0.3).length,
    };

    const riskFactorCounts: Record<string, number> = {};
    for (const c of churnRisks) {
      if (Array.isArray(c.riskFactors)) {
        for (const f of c.riskFactors as string[]) {
          riskFactorCounts[f] = (riskFactorCounts[f] ?? 0) + 1;
        }
      }
    }

    const anomalies = await db
      .select()
      .from(temporalAnomaliesTable)
      .orderBy(desc(temporalAnomaliesTable.detectedAt))
      .limit(20);

    const interestClusters = await db
      .select({
        cluster: interestGraphTable.interestCluster,
        ageGroup: interestGraphTable.ageGroup,
        count: sql<number>`SUM(${interestGraphTable.occurrenceCount})`,
        avgSentiment: sql<number>`AVG(${interestGraphTable.sentimentAffinity})`,
      })
      .from(interestGraphTable)
      .groupBy(interestGraphTable.interestCluster, interestGraphTable.ageGroup)
      .orderBy(desc(sql`SUM(${interestGraphTable.occurrenceCount})`))
      .limit(30);

    res.json({
      churn: {
        riskDistribution,
        topRisks: churnRisks.slice(0, 20).map(c => ({
          userId: c.userId,
          riskScore: c.churnRiskScore,
          predictedDate: c.predictedChurnDate,
          confidence: c.confidenceLevel,
          daysInactive: c.daysInactive,
          riskFactors: c.riskFactors,
          silenceGradient: c.silenceGradient,
          msgLengthGradient: c.messageLengthGradient,
        })),
        riskFactorFrequency: Object.entries(riskFactorCounts)
          .map(([factor, count]) => ({ factor, count }))
          .sort((a, b) => b.count - a.count),
      },
      anomalies: anomalies.map(a => ({
        type: a.anomalyType,
        severity: a.severity,
        metric: a.metricName,
        baseline: a.baselineValue,
        observed: a.observedValue,
        percentChange: a.percentChange,
        detectedAt: a.detectedAt,
        affectedUsers: a.affectedUsers,
        resolved: a.resolved,
      })),
      interestClusters,
    });
  } catch (error) {
    req.log.error(error, "Failed to get predictions");
    res.status(500).json({ error: "Failed to get predictions" });
  }
});

export default router;
