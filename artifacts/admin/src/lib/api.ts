import { auth } from "./firebase";

const API_BASE = "/api";

async function getAuthHeaders(): Promise<Record<string, string>> {
  const user = auth.currentUser;
  if (user) {
    const idToken = await user.getIdToken();
    return { "Authorization": `Bearer ${idToken}` };
  }
  return {};
}

async function fetchJson<T>(path: string): Promise<T> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE}${path}`, { headers });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
  overview: () => fetchJson<OverviewData>("/admin/analytics/overview"),
  conversations: () => fetchJson<ConversationData>("/admin/analytics/conversations"),
  safety: () => fetchJson<SafetyData>("/admin/analytics/safety"),
  demographics: () => fetchJson<DemographicsData>("/admin/analytics/demographics"),
  engagement: () => fetchJson<EngagementData>("/admin/analytics/engagement"),
  content: () => fetchJson<ContentData>("/admin/analytics/content"),
  website: () => fetchJson<WebsiteData>("/admin/analytics/website"),
  behavioral: () => fetchJson<BehavioralData>("/admin/analytics/behavioral"),
  network: () => fetchJson<NetworkData>("/admin/analytics/network"),
  predictions: () => fetchJson<PredictionsData>("/admin/analytics/predictions"),
  computeMetrics: () => postJson<{ ok: boolean }>("/admin/analytics/compute", {}),
  aiQuery: (question: string) => postJson<AiQueryResponse>("/admin/analytics/query", { question }),
  waitlist: (params: { search?: string; role?: string; page?: number }) =>
    fetchJson<WaitlistData>(`/admin/ops/waitlist?search=${encodeURIComponent(params.search || "")}&role=${params.role || "all"}&page=${params.page || 1}`),
  users: (params: { search?: string; role?: string; page?: number }) =>
    fetchJson<UsersData>(`/admin/ops/users?search=${encodeURIComponent(params.search || "")}&role=${params.role || "all"}&page=${params.page || 1}`),
  toggleAdmin: (userId: number) => postJson<{ ok: boolean; isAdmin: boolean }>(`/admin/ops/users/${userId}/toggle-admin`, {}),
  togglePause: (userId: number) => postJson<{ ok: boolean; isPaused: boolean }>(`/admin/ops/users/${userId}/toggle-pause`, {}),
  systemStatus: () => fetchJson<SystemStatusData>("/admin/ops/system-status"),
};

export interface OverviewData {
  kpis: {
    totalUsers: number;
    totalParents: number;
    totalChildren: number;
    totalMessages: number;
    totalConversations: number;
    totalAlerts: number;
    totalContacts: number;
    messages24h: number;
    messages7d: number;
    messages30d: number;
    alerts7d: number;
    newUsers7d: number;
    blockedMessages: number;
    faithModeUsers: number;
    flagRate: string;
    blockRate: string;
  };
  trends: {
    messageTrend: { day: string; count: number }[];
    alertTrend: { day: string; count: number }[];
    userGrowth: { day: string; count: number }[];
  };
}

export interface ConversationData {
  topicDistribution: { topic: string; count: number }[];
  sentimentOverTime: { day: string; avgSentiment: number; count: number }[];
  emotionalToneDistribution: { tone: string; count: number }[];
  vocabularyByAge: { ageGroup: string; avgComplexity: number; avgWordCount: number; count: number }[];
  averages: {
    avgWordCount: number;
    avgSentenceCount: number;
    avgComplexity: number;
    avgSentiment: number;
    avgResponseTime: number;
    emojiRate: number;
    slangRate: number;
  };
  conversationStarters: number;
  topicByAge: { ageGroup: string; topic: string; count: number }[];
  sentimentByTopic: { topic: string; avgSentiment: number; count: number }[];
}

export interface SafetyData {
  alertsByLevel: { level: string; count: number }[];
  alertsTrend: { day: string; count: number }[];
  blockedMessages: number;
  totalMessages: number;
  blockRate: string;
  alertReviewRate: string;
  topFlaggedChildren: {
    childId: number;
    count: number;
    ageGroup: string;
    grade: string;
    faithMode: boolean;
  }[];
  hourlyDistribution: { hour: number; count: number }[];
}

export interface DemographicsData {
  ageDistribution: { age: number; count: number }[];
  gradeDistribution: { grade: string; count: number }[];
  trustLevelDistribution: { level: number; count: number }[];
  faithMode: { enabled: number; total: number; adoptionRate: string };
  familySizeDistribution: Record<string, number>;
  avgChildrenPerFamily: string;
  pausedAccounts: number;
}

export interface EngagementData {
  sessions: {
    avgDuration: number;
    avgPages: number;
    avgEvents: number;
    totalSessions: number;
  };
  sessionsBySource: { source: string; count: number; avgDuration: number }[];
  sessionsByDevice: { device: string; count: number }[];
  dailySessions: { day: string; count: number }[];
  messagingPatterns: { hour: number; count: number }[];
  dayOfWeekPattern: { dow: number; count: number }[];
  topEvents: { eventName: string; count: number }[];
}

export interface ContentData {
  keywords: { keyword: string; category: string; occurrenceCount: number; ageGroup: string }[];
  topicTrend: { day: string; topic: string; count: number }[];
  sentimentByAge: { ageGroup: string; sentimentLabel: string; count: number }[];
  communicationComplexity: { day: string; avgWordCount: number; avgComplexity: number; avgSentences: number }[];
  emojiSlangUsage: { ageGroup: string; emojiRate: number; slangRate: number; count: number }[];
}

export interface WebsiteData {
  pageViews: { page: string; count: number }[];
  dailyTraffic: { day: string; count: number; uniqueVisitors: number }[];
  waitlistConversions: { day: string; count: number }[];
  referrers: { referrer: string; count: number }[];
  webSessions: { avgDuration: number; avgPages: number; totalSessions: number };
}

export interface BehavioralData {
  kpis: {
    avgVolatility: number;
    avgAnxiety: number;
    avgFatigue: number;
    avgSocialAvoidance: number;
    avgResponseLatency: number;
    avgEmojiRatio: number;
  };
  volatilityTrend: { date: string; avgVolatility: number; avgAnxiety: number; avgFatigue: number; usersAnalyzed: number }[];
  emojiTrend: { date: string; avgEmojiRatio: number; avgMsgLength: number }[];
  latestMetrics: {
    userId: number; date: string; volatility: number; anxiety: number;
    fatigue: number; socialAvoidance: number; responseLatency: number; emojiRatio: number;
  }[];
  anxietyLeaderboard: { userId: number; avgLatency: number; avgAnxiety: number }[];
}

export interface NetworkData {
  kpis: {
    avgInfluence: number; avgReciprocity: number; avgConnections: number;
    avgInitiation: number; avgReplyTrigger: number; graphDensity: number; totalNodes: number;
  };
  roleDistribution: { role: string; count: number }[];
  topInfluencers: { userId: number; influenceScore: number; replyTriggerRate: number; role: string; connections: number }[];
  networkTopology: string;
}

export interface PredictionsData {
  churn: {
    riskDistribution: { high: number; medium: number; low: number };
    topRisks: {
      userId: number; riskScore: number; predictedDate: string; confidence: number;
      daysInactive: number; riskFactors: string[]; silenceGradient: number; msgLengthGradient: number;
    }[];
    riskFactorFrequency: { factor: string; count: number }[];
  };
  anomalies: {
    type: string; severity: number; metric: string; baseline: number;
    observed: number; percentChange: number; detectedAt: string;
    affectedUsers: number; resolved: boolean;
  }[];
  interestClusters: { cluster: string; ageGroup: string; count: number; avgSentiment: number }[];
}

export interface AiQueryResponse {
  thinking: string;
  data: Record<string, unknown>[];
  chartType: string;
  chartConfig?: { xKey?: string; yKey?: string; label?: string };
  summary: string;
  sql?: string;
  rowCount?: number;
  error?: string;
}

export interface WaitlistData {
  entries: { id: number; email: string; name: string | null; role: string; createdAt: string }[];
  total: number;
  page: number;
  limit: number;
  roleCounts: Record<string, number>;
}

export interface UsersData {
  users: {
    id: number; email: string | null; displayName: string; role: string;
    parentId: number | null; grade: string | null; age: number | null;
    trustLevel: number | null; faithModeEnabled: boolean | null;
    isPaused: boolean | null; isAdmin: boolean | null;
    avatarColor: string | null; createdAt: string;
  }[];
  total: number;
  page: number;
  limit: number;
  roleCounts: { parent: number; child: number; admin: number };
}

export interface SystemStatusData {
  services: { name: string; status: string; latency: number | null; details: string }[];
  uptime: number;
  environment: string;
  version: string;
  nodeVersion: string;
  memoryUsage: { heapUsed: number; heapTotal: number; rss: number; external: number };
}
