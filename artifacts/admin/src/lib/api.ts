const API_BASE = "/api";
const ADMIN_KEY = "tether-admin-dev";

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "X-Admin-Key": ADMIN_KEY },
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
