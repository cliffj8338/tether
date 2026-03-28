import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { Fonts } from "@/constants/typography";
import { useAuth } from "@/context/AuthContext";
import { Avatar } from "@/components/ui/Avatar";
import { useConversations } from "@/hooks/useApiData";
import { api } from "@/services/api";
import type { UsageStats } from "@/services/api";

export default function ChildHomeScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { conversations, refresh } = useConversations();
  const [usage, setUsage] = useState<UsageStats | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      refresh();
      if (user?.id) {
        api.children.usage(user.id).then(setUsage).catch(() => {});
      }
      const interval = setInterval(() => {
        refresh();
        if (user?.id) {
          api.children.usage(user.id).then(setUsage).catch(() => {});
        }
      }, 5000);
      return () => clearInterval(interval);
    }, [refresh, user?.id])
  );

  const myConvos = conversations;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hey, {user?.displayName ?? "there"}!</Text>
          <Text style={styles.subtitle}>Your conversations</Text>
        </View>
        <Avatar name={user?.displayName ?? "K"} color={user?.avatarColor ?? Colors.accent} size={40} />
      </View>

      {usage && (usage.dailyMessageLimit > 0 || usage.screenTimeLimitMinutes > 0) && (
        <View style={styles.usageCard}>
          <Text style={styles.usageTitle}>Today's Activity</Text>
          <View style={styles.usageRow}>
            <View style={styles.usageItem}>
              <Feather name="message-square" size={16} color={Colors.accent} />
              <Text style={styles.usageNum}>{usage.messagesToday}</Text>
              <Text style={styles.usageLabel}>
                {usage.dailyMessageLimit > 0
                  ? `of ${usage.dailyMessageLimit} msgs`
                  : "messages"}
              </Text>
            </View>
            {usage.dailyMessageLimit > 0 && (
              <View style={styles.usageItem}>
                <Feather
                  name={usage.messagesToday >= usage.dailyMessageLimit ? "alert-circle" : "check-circle"}
                  size={16}
                  color={usage.messagesToday >= usage.dailyMessageLimit ? Colors.alert4 : Colors.primary}
                />
                <Text style={[styles.usageNum, usage.messagesToday >= usage.dailyMessageLimit ? { color: Colors.alert4 } : {}]}>
                  {Math.max(0, usage.dailyMessageLimit - usage.messagesToday)}
                </Text>
                <Text style={styles.usageLabel}>remaining</Text>
              </View>
            )}
            {usage.screenTimeLimitMinutes > 0 && (
              <View style={styles.usageItem}>
                <Feather name="clock" size={16} color={Colors.primary} />
                <Text style={styles.usageNum}>{usage.screenTimeLimitMinutes}</Text>
                <Text style={styles.usageLabel}>min limit</Text>
              </View>
            )}
          </View>
          {usage.dailyMessageLimit > 0 && (
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${Math.min(100, (usage.messagesToday / usage.dailyMessageLimit) * 100)}%`,
                    backgroundColor: usage.messagesToday >= usage.dailyMessageLimit ? Colors.alert4 : Colors.primary,
                  },
                ]}
              />
            </View>
          )}
        </View>
      )}

      <FlatList
        data={myConvos}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            style={styles.chatCard}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push(`/conversation/${item.id}`);
            }}
          >
            <Avatar name={item.contactName} color={item.contactAvatarColor} size={50} />
            <View style={styles.chatBody}>
              <View style={styles.chatRow1}>
                <Text style={styles.chatName}>{item.contactName}</Text>
                <Text style={styles.chatTime}>{item.lastMessageTime}</Text>
              </View>
              <Text style={styles.chatPreview} numberOfLines={1}>{item.lastMessage}</Text>
            </View>
            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{item.unreadCount}</Text>
              </View>
            )}
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Feather name="message-circle" size={48} color={Colors.accent} />
            </View>
            <Text style={styles.emptyTitle}>No chats yet</Text>
            <Text style={styles.emptyText}>Ask your parent to add a contact so you can start chatting!</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  greeting: {
    fontFamily: Fonts.heading,
    fontSize: 26,
    color: Colors.text,
    marginBottom: 2,
  },
  subtitle: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.textMid,
  },
  chatCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: 14,
    marginBottom: 10,
    gap: 12,
  },
  chatBody: { flex: 1 },
  chatRow1: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  chatName: { fontFamily: Fonts.bodyBold, fontSize: 16, color: Colors.text },
  chatTime: { fontFamily: Fonts.body, fontSize: 12, color: Colors.sand },
  chatPreview: { fontFamily: Fonts.body, fontSize: 14, color: Colors.textMid },
  unreadBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  unreadText: { fontFamily: Fonts.bodyBold, fontSize: 12, color: "white" },
  empty: {
    alignItems: "center",
    paddingTop: 60,
    gap: 12,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: `${Colors.accent}12`,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  emptyTitle: { fontFamily: Fonts.bodySemiBold, fontSize: 18, color: Colors.text },
  emptyText: { fontFamily: Fonts.body, fontSize: 14, color: Colors.textMid, textAlign: "center", paddingHorizontal: 40, lineHeight: 20 },
  usageCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 16,
  },
  usageTitle: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 13,
    color: Colors.textMid,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  usageRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  usageItem: {
    alignItems: "center",
    gap: 4,
  },
  usageNum: {
    fontFamily: Fonts.heading,
    fontSize: 22,
    color: Colors.text,
  },
  usageLabel: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: Colors.textMid,
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.surface,
    overflow: "hidden",
  },
  progressBarFill: {
    height: 6,
    borderRadius: 3,
  },
});
