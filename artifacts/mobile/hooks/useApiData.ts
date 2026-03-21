import { useState, useEffect, useCallback } from "react";
import { api } from "@/services/api";
import type { Child, Conversation, Contact, Alert, DashboardStats, FeedItem, Message } from "@/services/api";

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats>({ totalMessages: 0, flaggedMessages: 0, activeContacts: 0, unreadAlerts: 0 });
  const [children, setChildren] = useState<Child[]>([]);
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadAll = useCallback(async () => {
    try {
      const [s, c, f] = await Promise.all([
        api.dashboard.stats(),
        api.children.list(),
        api.dashboard.feed(),
      ]);
      setStats(s);
      setChildren(c);
      setFeedItems(f);
    } catch (err) {
      console.warn("Dashboard load error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadAll();
    setIsRefreshing(false);
  }, [loadAll]);

  useEffect(() => { loadAll(); }, [loadAll]);

  return { stats, children, feedItems, isRefreshing, isLoading, refresh };
}

export function useConversations(childId?: number) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await api.conversations.list(childId);
      setConversations(data);
    } catch (err) {
      console.warn("Conversations load error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [childId]);

  useEffect(() => { load(); }, [load]);

  return { conversations, isLoading, refresh: load };
}

export function useMessages(conversationId: number) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await api.messages.list(conversationId);
      setMessages(data);
    } catch (err) {
      console.warn("Messages load error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);

  const send = useCallback(async (content: string) => {
    try {
      const msg = await api.messages.send(conversationId, content);
      setMessages(prev => [...prev, msg]);
      return msg;
    } catch (err) {
      console.warn("Send message error:", err);
      throw err;
    }
  }, [conversationId]);

  useEffect(() => { load(); }, [load]);

  return { messages, isLoading, refresh: load, send };
}

export function useContacts(childId?: number) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await api.contacts.list(childId);
      setContacts(data);
    } catch (err) {
      console.warn("Contacts load error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [childId]);

  const approve = useCallback(async (contactId: number) => {
    try {
      await api.contacts.approve(contactId);
      await load();
    } catch (err) {
      console.warn("Approve contact error:", err);
      throw err;
    }
  }, [load]);

  const add = useCallback(async (data: { childId: number; contactName: string }) => {
    try {
      await api.contacts.add(data);
      await load();
    } catch (err) {
      console.warn("Add contact error:", err);
      throw err;
    }
  }, [load]);

  useEffect(() => { load(); }, [load]);

  return { contacts, isLoading, refresh: load, approve, add };
}

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await api.alerts.list();
      setAlerts(data);
    } catch (err) {
      console.warn("Alerts load error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markRead = useCallback(async (alertId: number) => {
    try {
      await api.alerts.markRead(alertId);
      setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, isRead: true } : a));
    } catch (err) {
      console.warn("Mark read error:", err);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { alerts, isLoading, refresh: load, markRead };
}

export function useChildDetail(childId: number) {
  const [child, setChild] = useState<Child | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [children, convos, ctcts] = await Promise.all([
        api.children.list(),
        api.conversations.list(childId),
        api.contacts.list(childId),
      ]);
      setChild(children.find(c => c.id === childId) ?? null);
      setConversations(convos);
      setContacts(ctcts);
    } catch (err) {
      console.warn("Child detail load error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [childId]);

  const updateTrustLevel = useCallback(async (level: number) => {
    try {
      const updated = await api.children.updateTrustLevel(childId, level);
      setChild(updated);
    } catch (err) {
      console.warn("Update trust level error:", err);
    }
  }, [childId]);

  const updateSettings = useCallback(async (data: Partial<{ faithModeEnabled: boolean; isPaused: boolean }>) => {
    try {
      const updated = await api.children.update(childId, data);
      setChild(updated);
    } catch (err) {
      console.warn("Update settings error:", err);
    }
  }, [childId]);

  useEffect(() => { load(); }, [load]);

  return { child, conversations, contacts, isLoading, refresh: load, updateTrustLevel, updateSettings };
}
