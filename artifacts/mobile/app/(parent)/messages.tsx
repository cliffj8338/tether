import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, TextInput } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { Fonts } from "@/constants/typography";
import { Avatar } from "@/components/ui/Avatar";
import { useConversations, useDashboard } from "@/hooks/useApiData";

export default function MessagesScreen() {
  const insets = useSafeAreaInsets();
  const { conversations, refresh: refreshConvos } = useConversations();
  const { children } = useDashboard();

  useFocusEffect(
    React.useCallback(() => {
      refreshConvos();
      const interval = setInterval(refreshConvos, 5000);
      return () => clearInterval(interval);
    }, [refreshConvos])
  );
  const [selectedChild, setSelectedChild] = useState<number | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<TextInput>(null);

  const filtered = conversations.filter((c) => {
    if (selectedChild && c.childId !== selectedChild) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return c.contactName.toLowerCase().includes(q) || c.lastMessage.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <Pressable style={[styles.searchBtn, searchOpen && { backgroundColor: Colors.primary, borderColor: Colors.primary }]} onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          if (searchOpen) {
            setSearchOpen(false);
            setSearchQuery("");
          } else {
            setSearchOpen(true);
            setTimeout(() => searchRef.current?.focus(), 100);
          }
        }}>
          <Feather name={searchOpen ? "x" : "search"} size={20} color={searchOpen ? Colors.white : Colors.textMid} />
        </Pressable>
      </View>

      {searchOpen && (
        <View style={styles.searchRow}>
          <Feather name="search" size={16} color={Colors.sand} />
          <TextInput
            ref={searchRef}
            style={styles.searchInput}
            placeholder="Search contacts or messages..."
            placeholderTextColor={Colors.sand}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery("")}>
              <Feather name="x-circle" size={16} color={Colors.sand} />
            </Pressable>
          )}
        </View>
      )}

      <View style={styles.filterRow}>
        <Pressable
          style={[styles.filterChip, !selectedChild && styles.filterChipActive]}
          onPress={() => setSelectedChild(null)}
        >
          <Text style={[styles.filterText, !selectedChild && styles.filterTextActive]}>All</Text>
        </Pressable>
        {children.map((child) => (
          <Pressable
            key={child.id}
            style={[styles.filterChip, selectedChild === child.id && styles.filterChipActive]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSelectedChild(selectedChild === child.id ? null : child.id);
            }}
          >
            <Text style={[styles.filterText, selectedChild === child.id && styles.filterTextActive]}>
              {child.displayName}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            style={styles.convoItem}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push(`/conversation/${item.id}`);
            }}
          >
            <Avatar name={item.contactName} color={item.contactAvatarColor} size={48} />
            <View style={styles.convoBody}>
              <View style={styles.convoRow1}>
                <Text style={styles.convoName}>{item.contactName}</Text>
                <Text style={styles.convoTime}>{item.lastMessageTime}</Text>
              </View>
              <View style={styles.convoRow2}>
                <Text style={styles.convoChildTag}>
                  {children.find((c) => c.id === item.childId)?.displayName}
                </Text>
                <Text style={styles.convoPreview} numberOfLines={1}>{item.lastMessage}</Text>
              </View>
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
            <Feather name="message-circle" size={48} color={Colors.border} />
            <Text style={styles.emptyTitle}>No conversations yet</Text>
            <Text style={styles.emptyText}>Messages will appear here once your children start chatting</Text>
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
    paddingVertical: 16,
  },
  title: { fontFamily: Fonts.heading, fontSize: 28, color: Colors.text },
  searchBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.text,
    padding: 0,
  },
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 12,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 13,
    color: Colors.textMid,
  },
  filterTextActive: {
    color: Colors.white,
  },
  convoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface,
  },
  convoBody: { flex: 1 },
  convoRow1: { flexDirection: "row", justifyContent: "space-between", marginBottom: 3 },
  convoName: { fontFamily: Fonts.bodyBold, fontSize: 15, color: Colors.text },
  convoTime: { fontFamily: Fonts.body, fontSize: 12, color: Colors.sand },
  convoRow2: { flexDirection: "row", alignItems: "center", gap: 6 },
  convoChildTag: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 11,
    color: Colors.primary,
    backgroundColor: `${Colors.primary}16`,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  convoPreview: { fontFamily: Fonts.body, fontSize: 13, color: Colors.textMid, flex: 1 },
  unreadBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  unreadText: { fontFamily: Fonts.bodyBold, fontSize: 11, color: "white" },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 12,
  },
  emptyTitle: { fontFamily: Fonts.bodySemiBold, fontSize: 16, color: Colors.text },
  emptyText: { fontFamily: Fonts.body, fontSize: 14, color: Colors.textMid, textAlign: "center", paddingHorizontal: 40 },
});
