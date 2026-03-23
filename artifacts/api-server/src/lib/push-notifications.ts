interface ExpoPushMessage {
  to: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  sound?: "default" | null;
  badge?: number;
  priority?: "default" | "normal" | "high";
  channelId?: string;
}

interface ExpoPushTicket {
  status: "ok" | "error";
  id?: string;
  message?: string;
  details?: Record<string, unknown>;
}

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

export async function sendPushNotification(
  pushToken: string,
  title: string,
  body: string,
  data?: Record<string, unknown>
): Promise<ExpoPushTicket | null> {
  if (!pushToken || !pushToken.startsWith("ExponentPushToken[")) {
    return null;
  }

  const message: ExpoPushMessage = {
    to: pushToken,
    title,
    body,
    data,
    sound: "default",
    priority: "high",
  };

  try {
    const response = await fetch(EXPO_PUSH_URL, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    const result = await response.json() as { data: ExpoPushTicket };
    return result.data;
  } catch {
    return null;
  }
}

export async function sendPushNotifications(
  messages: ExpoPushMessage[]
): Promise<ExpoPushTicket[]> {
  if (messages.length === 0) return [];

  const validMessages = messages.filter(
    (m) => m.to && m.to.startsWith("ExponentPushToken[")
  );

  if (validMessages.length === 0) return [];

  try {
    const response = await fetch(EXPO_PUSH_URL, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validMessages),
    });

    const result = await response.json() as { data: ExpoPushTicket[] };
    return result.data;
  } catch {
    return [];
  }
}

const ALERT_LEVEL_LABELS: Record<string, string> = {
  level1: "Low",
  level2: "Medium",
  level3: "Elevated",
  level4: "High",
  level5: "Critical",
};

export function buildAlertPushMessage(
  alertLevel: string,
  childName: string,
  title: string,
  description: string | null
): { pushTitle: string; pushBody: string } {
  const levelLabel = ALERT_LEVEL_LABELS[alertLevel] || "Alert";
  const pushTitle = `${levelLabel} Alert — ${childName}`;
  const pushBody = description || title;
  return { pushTitle, pushBody };
}
