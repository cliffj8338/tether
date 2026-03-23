import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DEV_DOMAIN = Constants.expoConfig?.extra?.EXPO_PUBLIC_DOMAIN
  ?? process.env.EXPO_PUBLIC_DOMAIN
  ?? "";

const API_BASE = DEV_DOMAIN
  ? `https://${DEV_DOMAIN}/api`
  : "http://localhost:8080/api";

async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem("tether_token");
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }

  return res.json();
}

export interface User {
  id: number;
  email: string | null;
  displayName: string;
  role: "parent" | "child";
  parentId: number | null;
  avatarColor: string;
  trustLevel: number;
  faithModeEnabled: boolean;
  isPaused: boolean;
  phone: string | null;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Child {
  id: number;
  displayName: string;
  avatarColor: string;
  grade: string | null;
  age: number | null;
  trustLevel: number;
  faithModeEnabled: boolean;
  isPaused: boolean;
  flagCount: number;
  messageCount: number;
}

export interface Conversation {
  id: number;
  childId: number;
  contactId: number;
  contactName: string;
  contactAvatarColor: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isPaused: boolean;
}

export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  senderName: string;
  content: string;
  alertLevel: string;
  isBlocked: boolean;
  createdAt: string;
  isMine: boolean;
}

export interface Contact {
  id: number;
  childId: number;
  contactChildId: number | null;
  contactName: string;
  avatarColor: string;
  approvedByParent: boolean;
  parentIntroSent: boolean;
  createdAt: string;
}

export interface Alert {
  id: number;
  parentId: number;
  childId: number;
  childName: string;
  messageId: number | null;
  alertLevel: string;
  title: string;
  description: string;
  messagePreview: string;
  isRead: boolean;
  createdAt: string;
  time: string;
  conversationId: number | null;
}

export interface DashboardStats {
  totalMessages: number;
  flaggedMessages: number;
  activeContacts: number;
  unreadAlerts: number;
}

export interface FeedItem {
  id: number;
  type: string;
  childName: string;
  contactName: string;
  preview: string;
  alertLevel: string;
  time: string;
  childAvatarColor: string;
}

export const api = {
  auth: {
    register(data: { email: string; displayName: string; password: string }): Promise<AuthResponse> {
      return request("/auth/register", { method: "POST", body: JSON.stringify(data) });
    },
    login(data: { email: string; password: string }): Promise<AuthResponse> {
      return request("/auth/login", { method: "POST", body: JSON.stringify(data) });
    },
    childLogin(data: { parentEmail: string; childName: string; pin: string }): Promise<AuthResponse> {
      return request("/auth/child-login", { method: "POST", body: JSON.stringify(data) });
    },
    me(): Promise<User> {
      return request("/users/me");
    },
    updateProfile(data: { phone?: string; displayName?: string }): Promise<User> {
      return request("/users/me", { method: "PATCH", body: JSON.stringify(data) });
    },
  },

  children: {
    list(): Promise<Child[]> {
      return request("/children");
    },
    add(data: { displayName: string; pin: string; age?: number; grade?: string }): Promise<Child> {
      return request("/children", { method: "POST", body: JSON.stringify(data) });
    },
    update(childId: number, data: Partial<{ trustLevel: number; faithModeEnabled: boolean; isPaused: boolean }>): Promise<Child> {
      return request(`/children/${childId}`, { method: "PATCH", body: JSON.stringify(data) });
    },
    updateTrustLevel(childId: number, trustLevel: number): Promise<Child> {
      return request(`/children/${childId}/trust-level`, { method: "PATCH", body: JSON.stringify({ trustLevel }) });
    },
  },

  conversations: {
    list(childId?: number): Promise<Conversation[]> {
      const q = childId ? `?childId=${childId}` : "";
      return request(`/conversations${q}`);
    },
  },

  messages: {
    list(conversationId: number): Promise<Message[]> {
      return request(`/conversations/${conversationId}/messages`);
    },
    send(conversationId: number, content: string): Promise<Message> {
      return request(`/conversations/${conversationId}/messages`, {
        method: "POST",
        body: JSON.stringify({ content }),
      });
    },
  },

  contacts: {
    list(childId?: number): Promise<Contact[]> {
      const q = childId ? `?childId=${childId}` : "";
      return request(`/contacts${q}`);
    },
    add(data: { childId: number; contactName: string; contactChildId?: number }): Promise<Contact> {
      return request("/contacts", { method: "POST", body: JSON.stringify(data) });
    },
    approve(contactId: number): Promise<Contact> {
      return request(`/contacts/${contactId}/approve`, { method: "POST" });
    },
  },

  alerts: {
    list(): Promise<Alert[]> {
      return request("/alerts");
    },
    markRead(alertId: number): Promise<void> {
      return request(`/alerts/${alertId}/read`, { method: "POST" });
    },
  },

  pushToken: {
    register(token: string): Promise<{ success: boolean }> {
      return request("/push-token", { method: "POST", body: JSON.stringify({ token }) });
    },
    remove(): Promise<{ success: boolean }> {
      return request("/push-token", { method: "DELETE" });
    },
  },

  dashboard: {
    stats(): Promise<DashboardStats> {
      return request("/dashboard/stats");
    },
    feed(): Promise<FeedItem[]> {
      return request("/dashboard/feed");
    },
  },
};
