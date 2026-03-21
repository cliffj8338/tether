import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import Colors from "@/constants/colors";
import { Fonts } from "@/constants/typography";
import { useAuth } from "@/context/AuthContext";
import { Avatar } from "@/components/ui/Avatar";

const trustLevelLabels = [
  "",
  "Full View",
  "Monitored",
  "Flagged Only",
  "Alerts Only",
  "Independent",
];

export default function ChildProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/onboarding");
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Me</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <Avatar name={user?.displayName ?? "K"} color={user?.avatarColor ?? Colors.accent} size={72} />
          <Text style={styles.profileName}>{user?.displayName}</Text>
          <View style={styles.trustBadge}>
            <Feather name="shield" size={12} color={Colors.primary} />
            <Text style={styles.trustText}>
              Trust Level {user?.trustLevel ?? 1}: {trustLevelLabels[user?.trustLevel ?? 1]}
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>14</Text>
            <Text style={styles.statLabel}>Messages</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>Friends</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: Colors.primary }]}>Level {user?.trustLevel ?? 1}</Text>
            <Text style={styles.statLabel}>Trust</Text>
          </View>
        </View>

        <View style={styles.group}>
          <Pressable style={styles.row}>
            <View style={[styles.rowIcon, { backgroundColor: `${Colors.accent}16` }]}>
              <Feather name="smile" size={18} color={Colors.accent} />
            </View>
            <Text style={styles.rowLabel}>My Stickers</Text>
            <Feather name="chevron-right" size={18} color={Colors.sand} />
          </Pressable>
          <Pressable style={styles.row}>
            <View style={[styles.rowIcon, { backgroundColor: `${Colors.primary}16` }]}>
              <Feather name="shield" size={18} color={Colors.primary} />
            </View>
            <Text style={styles.rowLabel}>Safety Info</Text>
            <Feather name="chevron-right" size={18} color={Colors.sand} />
          </Pressable>
        </View>

        <Pressable style={styles.logoutBtn} onPress={handleLogout}>
          <Feather name="log-out" size={16} color={Colors.alert4} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: { fontFamily: Fonts.heading, fontSize: 28, color: Colors.text },
  profileCard: {
    alignItems: "center",
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    padding: 24,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginBottom: 16,
    gap: 10,
  },
  profileName: { fontFamily: Fonts.heading, fontSize: 24, color: Colors.text },
  trustBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: `${Colors.primary}12`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  trustText: { fontFamily: Fonts.bodySemiBold, fontSize: 12, color: Colors.primaryDark },
  statsRow: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  statValue: { fontFamily: Fonts.heading, fontSize: 22, color: Colors.text },
  statLabel: { fontFamily: Fonts.body, fontSize: 12, color: Colors.textMid },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
  },
  group: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginBottom: 20,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface,
  },
  rowIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: { fontFamily: Fonts.bodySemiBold, fontSize: 14, color: Colors.text, flex: 1 },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    marginHorizontal: 16,
    backgroundColor: `${Colors.alert4}08`,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: `${Colors.alert4}20`,
  },
  logoutText: { fontFamily: Fonts.bodyBold, fontSize: 14, color: Colors.alert4 },
});
