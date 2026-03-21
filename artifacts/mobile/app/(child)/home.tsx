import React from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { Fonts } from "@/constants/typography";
import { useAuth } from "@/context/AuthContext";
import { Avatar } from "@/components/ui/Avatar";
import { useConversations } from "@/hooks/useApiData";

export default function ChildHomeScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { conversations } = useConversations();

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
});
