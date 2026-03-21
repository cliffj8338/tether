import { useState, useCallback } from "react";
import Colors from "@/constants/colors";

interface DemoChild {
  id: number;
  displayName: string;
  avatarColor: string;
  grade: string;
  age: number;
  trustLevel: number;
  faithModeEnabled: boolean;
  isPaused: boolean;
  flagCount: number;
  messageCount: number;
}

interface DemoFeedItem {
  id: number;
  childName: string;
  contactName: string;
  alertLevel: string;
  alertLabel: string;
  preview: string;
  time: string;
}

interface DemoConversation {
  id: number;
  childId: number;
  contactName: string;
  contactAvatarColor: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  alertLevel: string;
}

interface DemoMessage {
  id: number;
  senderId: number;
  senderName: string;
  content: string;
  alertLevel: string;
  isBlocked: boolean;
  createdAt: string;
  isMine: boolean;
}

interface DemoAlert {
  id: number;
  childName: string;
  alertLevel: string;
  title: string;
  description: string;
  isRead: boolean;
  time: string;
  messagePreview: string;
}

interface DemoContact {
  id: number;
  childId: number;
  contactName: string;
  approvedByParent: boolean;
  parentIntroSent: boolean;
  avatarColor: string;
}

const demoChildren: DemoChild[] = [
  {
    id: 1,
    displayName: "Olivia",
    avatarColor: Colors.primary,
    grade: "Grade 4 · Age 10",
    age: 10,
    trustLevel: 2,
    faithModeEnabled: true,
    isPaused: false,
    flagCount: 1,
    messageCount: 14,
  },
  {
    id: 2,
    displayName: "Liam",
    avatarColor: Colors.accent,
    grade: "Grade 2 · Age 8",
    age: 8,
    trustLevel: 1,
    faithModeEnabled: false,
    isPaused: false,
    flagCount: 0,
    messageCount: 9,
  },
];

const demoFeed: DemoFeedItem[] = [
  {
    id: 1,
    childName: "Olivia",
    contactName: "Emma K.",
    alertLevel: "level4",
    alertLabel: "Level 4 — High Priority",
    preview: "Flagged message blocked — explicit link detected.",
    time: "2m ago",
  },
  {
    id: 2,
    childName: "Liam",
    contactName: "Noah T.",
    alertLevel: "level2",
    alertLabel: "Level 2 — Warning",
    preview: "Message paused — off-topic subject flagged for review.",
    time: "21m ago",
  },
  {
    id: 3,
    childName: "Olivia",
    contactName: "Sophie M.",
    alertLevel: "none",
    alertLabel: "Conversation",
    preview: "Hey can you come to practice tomorrow after school?",
    time: "38m ago",
  },
  {
    id: 4,
    childName: "Liam",
    contactName: "Jack R.",
    alertLevel: "level1",
    alertLabel: "Level 1 — Soft flag",
    preview: "Mild language noted. Message delivered.",
    time: "1h ago",
  },
  {
    id: 5,
    childName: "Olivia",
    contactName: "Emma K.",
    alertLevel: "none",
    alertLabel: "Conversation",
    preview: "Did you finish the reading for tomorrow?",
    time: "2h ago",
  },
];

const demoConversations: DemoConversation[] = [
  {
    id: 1,
    childId: 1,
    contactName: "Emma K.",
    contactAvatarColor: "#E88B7A",
    lastMessage: "Hey can you come to practice tomorrow?",
    lastMessageTime: "38m ago",
    unreadCount: 2,
    alertLevel: "none",
  },
  {
    id: 2,
    childId: 1,
    contactName: "Sophie M.",
    contactAvatarColor: "#7B8EC4",
    lastMessage: "Did you finish the reading for tomorrow?",
    lastMessageTime: "2h ago",
    unreadCount: 0,
    alertLevel: "none",
  },
  {
    id: 3,
    childId: 2,
    contactName: "Noah T.",
    contactAvatarColor: "#6B9E8A",
    lastMessage: "Wanna play after school?",
    lastMessageTime: "21m ago",
    unreadCount: 1,
    alertLevel: "level2",
  },
  {
    id: 4,
    childId: 2,
    contactName: "Jack R.",
    contactAvatarColor: "#C49A3A",
    lastMessage: "That was so cool!",
    lastMessageTime: "1h ago",
    unreadCount: 0,
    alertLevel: "none",
  },
];

const demoMessages: Record<number, DemoMessage[]> = {
  1: [
    { id: 1, senderId: 1, senderName: "Olivia", content: "Hey Emma!", alertLevel: "none", isBlocked: false, createdAt: "2:30 PM", isMine: true },
    { id: 2, senderId: 3, senderName: "Emma K.", content: "Hi Olivia! How was school?", alertLevel: "none", isBlocked: false, createdAt: "2:31 PM", isMine: false },
    { id: 3, senderId: 1, senderName: "Olivia", content: "It was good! We did a science experiment", alertLevel: "none", isBlocked: false, createdAt: "2:32 PM", isMine: true },
    { id: 4, senderId: 3, senderName: "Emma K.", content: "That sounds fun! What kind?", alertLevel: "none", isBlocked: false, createdAt: "2:33 PM", isMine: false },
    { id: 5, senderId: 1, senderName: "Olivia", content: "We made volcanoes with baking soda!", alertLevel: "none", isBlocked: false, createdAt: "2:35 PM", isMine: true },
    { id: 6, senderId: 3, senderName: "Emma K.", content: "Hey can you come to practice tomorrow after school?", alertLevel: "none", isBlocked: false, createdAt: "2:38 PM", isMine: false },
  ],
  2: [
    { id: 7, senderId: 1, senderName: "Olivia", content: "Did you start the reading yet?", alertLevel: "none", isBlocked: false, createdAt: "1:00 PM", isMine: true },
    { id: 8, senderId: 4, senderName: "Sophie M.", content: "Not yet, which chapter?", alertLevel: "none", isBlocked: false, createdAt: "1:05 PM", isMine: false },
    { id: 9, senderId: 1, senderName: "Olivia", content: "Chapter 5 I think", alertLevel: "none", isBlocked: false, createdAt: "1:06 PM", isMine: true },
    { id: 10, senderId: 4, senderName: "Sophie M.", content: "Did you finish the reading for tomorrow?", alertLevel: "none", isBlocked: false, createdAt: "1:30 PM", isMine: false },
  ],
  3: [
    { id: 11, senderId: 2, senderName: "Liam", content: "Hi Noah!", alertLevel: "none", isBlocked: false, createdAt: "3:00 PM", isMine: true },
    { id: 12, senderId: 5, senderName: "Noah T.", content: "Hey! Wanna play after school?", alertLevel: "none", isBlocked: false, createdAt: "3:02 PM", isMine: false },
    { id: 13, senderId: 2, senderName: "Liam", content: "Yes! Can we play Minecraft?", alertLevel: "none", isBlocked: false, createdAt: "3:05 PM", isMine: true },
  ],
  4: [
    { id: 14, senderId: 2, senderName: "Liam", content: "Did you see the new playground?", alertLevel: "none", isBlocked: false, createdAt: "2:00 PM", isMine: true },
    { id: 15, senderId: 6, senderName: "Jack R.", content: "That was so cool!", alertLevel: "none", isBlocked: false, createdAt: "2:05 PM", isMine: false },
  ],
};

const demoAlerts: DemoAlert[] = [
  {
    id: 1,
    childName: "Olivia",
    alertLevel: "level4",
    title: "High Priority — Review Required",
    description: "Flagged message blocked — explicit link detected in conversation with Emma K.",
    isRead: false,
    time: "2m ago",
    messagePreview: "[Message blocked — content violated safety rules]",
  },
  {
    id: 2,
    childName: "Liam",
    alertLevel: "level2",
    title: "Mild Language Noted",
    description: "Message paused for review. Off-topic content flagged.",
    isRead: false,
    time: "21m ago",
    messagePreview: "Message contained flagged content for review.",
  },
  {
    id: 3,
    childName: "Liam",
    alertLevel: "level1",
    title: "Soft Flag — Tone",
    description: "Casual tone detected in conversation with Jack R. Message delivered.",
    isRead: true,
    time: "1h ago",
    messagePreview: "Mild language noted. Message delivered.",
  },
];

const demoContacts: DemoContact[] = [
  { id: 1, childId: 1, contactName: "Emma K.", approvedByParent: true, parentIntroSent: true, avatarColor: "#E88B7A" },
  { id: 2, childId: 1, contactName: "Sophie M.", approvedByParent: true, parentIntroSent: true, avatarColor: "#7B8EC4" },
  { id: 3, childId: 2, contactName: "Noah T.", approvedByParent: true, parentIntroSent: false, avatarColor: "#6B9E8A" },
  { id: 4, childId: 2, contactName: "Jack R.", approvedByParent: true, parentIntroSent: true, avatarColor: "#C49A3A" },
  { id: 5, childId: 1, contactName: "Mia L.", approvedByParent: false, parentIntroSent: false, avatarColor: "#7A6EA8" },
];

export function useDemoData() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshAll = useCallback(async () => {
    setIsRefreshing(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsRefreshing(false);
  }, []);

  return {
    children: demoChildren,
    feedItems: demoFeed,
    stats: {
      totalMessages: 23,
      flaggedMessages: 3,
      activeContacts: 5,
      unreadAlerts: 2,
    },
    conversations: demoConversations,
    getMessages: (convoId: number) => demoMessages[convoId] ?? [],
    alerts: demoAlerts,
    contacts: demoContacts,
    refreshAll,
    isRefreshing,
  };
}
