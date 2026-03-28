import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { Fonts } from "@/constants/typography";
import { useAuth } from "@/context/AuthContext";
import { Avatar } from "@/components/ui/Avatar";
import { useMessages, useConversations } from "@/hooks/useApiData";
import { EmojiPicker } from "@/components/EmojiPicker";
import { api } from "@/services/api";
import type { UsageStats } from "@/services/api";

function formatTime(iso: string): string {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (d.toDateString() === now.toDateString()) {
      return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    }
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

export default function ConversationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const convoId = parseInt(id ?? "0");
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { conversations } = useConversations();
  const { messages, send, refresh: refreshMessages } = useMessages(convoId);
  const isChild = user?.role === "child";

  const convo = conversations.find((c) => c.id === convoId);

  useFocusEffect(
    useCallback(() => {
      refreshMessages();
      const interval = setInterval(refreshMessages, 3000);
      return () => clearInterval(interval);
    }, [refreshMessages])
  );

  const [inputText, setInputText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [usage, setUsage] = useState<UsageStats | null>(null);
  const [sendError, setSendError] = useState("");

  useFocusEffect(
    useCallback(() => {
      if (isChild && user?.id) {
        api.children.usage(user.id).then(setUsage).catch(() => {});
      }
    }, [isChild, user?.id])
  );

  const handleSend = useCallback(async () => {
    if (!inputText.trim()) return;
    setSendError("");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await send(inputText.trim());
      setInputText("");
      setShowEmoji(false);
      if (isChild && user?.id) {
        api.children.usage(user.id).then(setUsage).catch(() => {});
      }
    } catch (err: any) {
      const msg = err?.message || "";
      if (msg.includes("limit")) {
        setSendError("You've reached your daily message limit!");
      } else if (msg.includes("wait") || msg.includes("cooldown")) {
        setSendError("Slow down! Wait a moment before sending again.");
      } else {
        setSendError("Couldn't send message. Try again.");
        console.warn("Send failed:", err);
      }
    }
  }, [inputText, send, isChild, user?.id]);

  const handleEmojiSelect = (emoji: string) => {
    setInputText((prev) => prev + emoji);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={Colors.text} />
        </Pressable>
        <Avatar name={convo?.contactName ?? "?"} color={convo?.contactAvatarColor ?? Colors.accent} size={36} />
        <View style={styles.headerBody}>
          <Text style={styles.headerName}>{convo?.contactName ?? "Chat"}</Text>
          <Text style={styles.headerStatus}>Online</Text>
        </View>
        {!isChild && (
          <Pressable style={styles.headerBtn}>
            <Feather name="shield" size={18} color={Colors.primary} />
          </Pressable>
        )}
      </View>

      <KeyboardAvoidingView
        behavior="padding"
        style={styles.flex}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          inverted={false}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View
              style={[
                styles.msgRow,
                item.isMine ? styles.msgRowMine : styles.msgRowTheirs,
              ]}
            >
              {!item.isMine && (
                <Avatar name={item.senderName} color={convo?.contactAvatarColor ?? Colors.accent} size={28} />
              )}
              <View
                style={[
                  styles.bubble,
                  item.isMine ? styles.bubbleMine : styles.bubbleTheirs,
                  item.isBlocked && styles.bubbleBlocked,
                ]}
              >
                <Text
                  style={[
                    styles.bubbleText,
                    item.isMine ? styles.bubbleTextMine : styles.bubbleTextTheirs,
                  ]}
                >
                  {item.isBlocked ? "[Message blocked by content filter]" : item.content}
                </Text>
                <Text style={[styles.bubbleTime, item.isMine && styles.bubbleTimeMine]}>
                  {formatTime(item.createdAt)}
                </Text>
              </View>
            </View>
          )}
        />

        {isChild && showEmoji && (
          <EmojiPicker onSelect={handleEmojiSelect} onClose={() => setShowEmoji(false)} />
        )}

        {sendError ? (
          <View style={styles.errorBanner}>
            <Feather name="alert-circle" size={14} color={Colors.alert4} />
            <Text style={styles.errorText}>{sendError}</Text>
          </View>
        ) : null}

        {isChild && usage && usage.dailyMessageLimit > 0 && (
          <View style={styles.usageBanner}>
            <Feather name="message-square" size={12} color={Colors.textMid} />
            <Text style={styles.usageBannerText}>
              {Math.max(0, usage.dailyMessageLimit - usage.messagesToday)} messages remaining today
            </Text>
          </View>
        )}

        <View style={[styles.inputBar, { paddingBottom: insets.bottom + 8 }]}>
          {isChild && (
            <Pressable
              style={styles.emojiBtn}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowEmoji(!showEmoji);
              }}
            >
              <Feather name="smile" size={22} color={showEmoji ? Colors.accent : Colors.textMid} />
            </Pressable>
          )}
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              placeholderTextColor={Colors.sand}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
          </View>
          <Pressable
            style={[styles.sendBtn, !!inputText.trim() && styles.sendBtnActive]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Feather name="send" size={18} color={inputText.trim() ? Colors.white : Colors.sand} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerBody: { flex: 1 },
  headerName: { fontFamily: Fonts.bodyBold, fontSize: 16, color: Colors.text },
  headerStatus: { fontFamily: Fonts.body, fontSize: 12, color: Colors.primary },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: `${Colors.primary}12`,
    alignItems: "center",
    justifyContent: "center",
  },
  messageList: {
    padding: 16,
    gap: 6,
  },
  msgRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    marginBottom: 6,
  },
  msgRowMine: { justifyContent: "flex-end" },
  msgRowTheirs: { justifyContent: "flex-start" },
  bubble: {
    maxWidth: "75%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  bubbleMine: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleTheirs: {
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bubbleBlocked: {
    backgroundColor: `${Colors.alert4}12`,
    borderColor: `${Colors.alert4}30`,
  },
  bubbleText: {
    fontFamily: Fonts.body,
    fontSize: 15,
    lineHeight: 21,
  },
  bubbleTextMine: { color: Colors.white },
  bubbleTextTheirs: { color: Colors.text },
  bubbleTime: {
    fontFamily: Fonts.body,
    fontSize: 10,
    color: Colors.textMid,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  bubbleTimeMine: { color: "rgba(255,255,255,0.7)" },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingTop: 10,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 8,
  },
  emojiBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  inputWrap: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
  },
  input: {
    fontFamily: Fonts.body,
    fontSize: 15,
    color: Colors.text,
    maxHeight: 80,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnActive: {
    backgroundColor: Colors.primary,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: `${Colors.alert4}12`,
    borderTopWidth: 1,
    borderTopColor: `${Colors.alert4}30`,
  },
  errorText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 12,
    color: Colors.alert4,
  },
  usageBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 6,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  usageBannerText: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: Colors.textMid,
  },
});
