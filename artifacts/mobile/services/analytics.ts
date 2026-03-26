import Constants from "expo-constants";
import { Platform } from "react-native";

const DEV_DOMAIN = Constants.expoConfig?.extra?.EXPO_PUBLIC_DOMAIN
  ?? process.env.EXPO_PUBLIC_DOMAIN
  ?? "";

const API_BASE = DEV_DOMAIN
  ? `https://${DEV_DOMAIN}/api`
  : "http://localhost:8080/api";

let sessionId: string | null = null;

function getSessionId(): string {
  if (!sessionId) {
    sessionId = `app_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  }
  return sessionId;
}

async function send(eventName: string, userId?: number | null, metadata?: Record<string, unknown>) {
  try {
    await fetch(`${API_BASE}/analytics/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "app",
        eventName,
        sessionId: getSessionId(),
        userId: userId ?? null,
        metadata,
      }),
    });
  } catch {
    // silent
  }
}

export const appAnalytics = {
  startSession(userId?: number | null) {
    fetch(`${API_BASE}/analytics/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: getSessionId(),
        source: "app",
        userId: userId ?? null,
        deviceType: "mobile",
        platform: Platform.OS,
        appVersion: "1.0.0",
      }),
    }).catch(() => {});
  },

  screenView(screen: string, userId?: number | null) {
    send("screen_view", userId, { screen });
  },

  messageSent(userId?: number | null, conversationId?: number) {
    send("message_sent", userId, { conversationId });
  },

  alertViewed(userId?: number | null, alertId?: number) {
    send("alert_viewed", userId, { alertId });
  },

  featureUsed(feature: string, userId?: number | null) {
    send("feature_used", userId, { feature });
  },

  loginSuccess(userId: number, role: string) {
    send("login", userId, { role });
  },

  contactAdded(userId?: number | null) {
    send("contact_added", userId);
  },

  trustLevelChanged(userId: number | null | undefined, newLevel: number) {
    send("trust_level_changed", userId, { newLevel });
  },
};
