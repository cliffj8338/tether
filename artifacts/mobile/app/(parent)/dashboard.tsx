import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { Fonts } from "@/constants/typography";
import { useAuth } from "@/context/AuthContext";
import { Avatar } from "@/components/ui/Avatar";
import { StatCard } from "@/components/ui/StatCard";
import { AlertLevelTag } from "@/components/ui/AlertLevelTag";
import { useDemoData } from "@/hooks/useDemoData";
import { TetherMark } from "@/components/icons/TetherMark";

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { children, feedItems, stats, refreshAll, isRefreshing } = useDemoData();
  const [activeChild, setActiveChild] = useState(0);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.topbar}>
        <View style={styles.topbarLeft}>
          <TetherMark size={30} color={Colors.primary} endpointOpacity={0.55} />
          <Text style={styles.logoText}>Tether</Text>
        </View>
        <View style={styles.topbarRight}>
          <Pressable
            style={styles.iconBtn}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <Feather name="search" size={18} color={Colors.textMid} />
          </Pressable>
          <Pressable style={styles.iconBtn}>
            <Feather name="bell" size={18} color={Colors.textMid} />
            {stats.unreadAlerts > 0 && (
              <View style={styles.notifBadge}>
                <Text style={styles.notifBadgeText}>{stats.unreadAlerts}</Text>
              </View>
            )}
          </Pressable>
          <Avatar name={user?.displayName ?? "P"} color={Colors.accent} size={34} />
        </View>
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refreshAll} tintColor={Colors.primary} />
        }
      >
        <View style={styles.greeting}>
          <Text style={styles.greetingSub}>{greeting.toUpperCase()}</Text>
          <Text style={styles.greetingName}>
            {user?.displayName ?? "Parent"}
          </Text>
        </View>

        {stats.unreadAlerts > 0 && (
          <Pressable
            style={styles.alertBanner}
            onPress={() => router.push("/(parent)/alerts")}
          >
            <View style={styles.alertIconWrap}>
              <Feather name="alert-triangle" size={18} color={Colors.alert4} />
            </View>
            <View style={styles.alertBody}>
              <Text style={styles.alertTitle}>{stats.unreadAlerts} alert{stats.unreadAlerts > 1 ? "s" : ""} need review</Text>
              <Text style={styles.alertDesc}>Tap to review flagged messages</Text>
            </View>
            <Feather name="chevron-right" size={16} color={Colors.sand} />
          </Pressable>
        )}

        <View style={styles.secHead}>
          <Text style={styles.secTitle}>Overview</Text>
        </View>
        <View style={styles.statsRow}>
          <StatCard value={stats.totalMessages} label="Messages Today" color={Colors.primary} />
          <StatCard value={stats.flaggedMessages} label="Flagged" color={Colors.accent} />
          <StatCard value={stats.activeContacts} label="Contacts" color={Colors.alert3} />
        </View>

        <View style={styles.secHead}>
          <Text style={styles.secTitle}>Your Children</Text>
          <Pressable onPress={() => {}}>
            <Text style={styles.secLink}>Add Child</Text>
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.childrenRow}>
          {children.map((child, i) => (
            <Pressable
              key={child.id}
              style={[styles.childCard, activeChild === i && styles.childCardActive]}
              onPress={() => {
                setActiveChild(i);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push(`/child-detail/${child.id}`);
              }}
            >
              {child.flagCount > 0 && (
                <View style={styles.childFlagBadge}>
                  <Text style={styles.childFlagText}>{child.flagCount}</Text>
                </View>
              )}
              <Avatar name={child.displayName} color={child.avatarColor} size={42} />
              <Text style={styles.childName}>{child.displayName}</Text>
              <Text style={styles.childGrade}>{child.grade}</Text>
              <View style={styles.childStat}>
                <Feather name="message-circle" size={12} color={Colors.textMid} />
                <Text style={styles.childStatText}>{child.messageCount} msgs</Text>
              </View>
            </Pressable>
          ))}
          <Pressable style={styles.addChildCard} onPress={() => {}}>
            <View style={styles.addChildIcon}>
              <Feather name="plus" size={20} color={Colors.textMid} />
            </View>
            <Text style={styles.addChildLabel}>Add Child</Text>
          </Pressable>
        </ScrollView>

        <View style={styles.secHead}>
          <Text style={styles.secTitle}>Recent Activity</Text>
          <Pressable>
            <Text style={styles.secLink}>View All</Text>
          </Pressable>
        </View>
        <View style={styles.feed}>
          {feedItems.map((item) => (
            <Pressable
              key={item.id}
              style={styles.feedItem}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <View style={[
                styles.feedStrip,
                { backgroundColor: getAlertColor(item.alertLevel) },
              ]} />
              <View style={[
                styles.feedIconWrap,
                { backgroundColor: `${getAlertColor(item.alertLevel)}16` },
              ]}>
                <Feather
                  name={item.alertLevel === "none" ? "message-circle" : "alert-triangle"}
                  size={16}
                  color={getAlertColor(item.alertLevel)}
                />
              </View>
              <View style={styles.feedBody}>
                <View style={styles.feedRow1}>
                  <Text style={styles.feedWho}>
                    {item.childName}
                    <Text style={styles.feedWith}> with {item.contactName}</Text>
                  </Text>
                  <Text style={styles.feedTime}>{item.time}</Text>
                </View>
                <Text style={styles.feedPreview} numberOfLines={1}>{item.preview}</Text>
                <AlertLevelTag level={item.alertLevel} label={item.alertLabel} />
              </View>
            </Pressable>
          ))}
        </View>

        <View style={styles.secHead}>
          <Text style={styles.secTitle}>Quick Actions</Text>
        </View>
        <View style={styles.actionsGrid}>
          <ActionButton
            icon="lock"
            iconColor={Colors.primary}
            label="Pause All"
            sub="Temporarily pause chats"
          />
          <ActionButton
            icon="sliders"
            iconColor={Colors.accent}
            label="Content Settings"
            sub="Manage filters & rules"
          />
          <ActionButton
            icon="users"
            iconColor={Colors.textMid}
            label="Manage Contacts"
            sub="Approve or remove"
          />
          <ActionButton
            icon="download"
            iconColor={Colors.alert3}
            label="Export History"
            sub="Download logs"
          />
        </View>
      </ScrollView>
    </View>
  );
}

function ActionButton({ icon, iconColor, label, sub }: {
  icon: keyof typeof Feather.glyphMap;
  iconColor: string;
  label: string;
  sub: string;
}) {
  return (
    <Pressable style={styles.actionBtn}>
      <View style={[styles.actionIconWrap, { backgroundColor: `${iconColor}16` }]}>
        <Feather name={icon} size={18} color={iconColor} />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
      <Text style={styles.actionSub}>{sub}</Text>
    </Pressable>
  );
}

function getAlertColor(level: string): string {
  const colors: Record<string, string> = {
    none: Colors.primary,
    level1: Colors.alert1,
    level2: Colors.alert2,
    level3: Colors.alert3,
    level4: Colors.alert4,
    level5: Colors.alert5,
  };
  return colors[level] ?? Colors.primary;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "rgba(255,255,255,0.94)",
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  topbarLeft: { flexDirection: "row", alignItems: "center", gap: 9 },
  logoText: { fontFamily: Fonts.headingItalic, fontSize: 19, color: Colors.text, letterSpacing: -0.5 },
  topbarRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  notifBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    width: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: Colors.alert4,
    borderWidth: 2,
    borderColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  notifBadgeText: {
    fontSize: 9,
    fontFamily: Fonts.bodyBold,
    color: "white",
  },
  body: { flex: 1, paddingHorizontal: 16, paddingTop: 20 },
  greeting: { marginBottom: 20 },
  greetingSub: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 12,
    letterSpacing: 0.3,
    color: Colors.textMid,
    marginBottom: 3,
  },
  greetingName: {
    fontFamily: Fonts.heading,
    fontSize: 24,
    color: Colors.text,
  },
  alertBanner: {
    backgroundColor: `${Colors.alert4}0D`,
    borderWidth: 1.5,
    borderColor: `${Colors.alert4}38`,
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 18,
  },
  alertIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: `${Colors.alert4}16`,
    alignItems: "center",
    justifyContent: "center",
  },
  alertBody: { flex: 1 },
  alertTitle: { fontFamily: Fonts.bodyBold, fontSize: 13, color: Colors.alert4, marginBottom: 3 },
  alertDesc: { fontFamily: Fonts.body, fontSize: 12, color: Colors.textMid },
  secHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 11,
  },
  secTitle: { fontFamily: Fonts.bodyBold, fontSize: 13, letterSpacing: 0.2, color: Colors.text },
  secLink: { fontFamily: Fonts.bodyBold, fontSize: 12, color: Colors.accent },
  statsRow: { flexDirection: "row", gap: 9, marginBottom: 22 },
  childrenRow: { marginBottom: 22 },
  childCard: {
    width: 128,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 18,
    padding: 15,
    marginRight: 10,
    alignItems: "flex-start",
  },
  childCardActive: { borderColor: Colors.primary },
  childFlagBadge: {
    position: "absolute",
    top: 9,
    right: 9,
    width: 20,
    height: 20,
    borderRadius: 7,
    backgroundColor: Colors.alert4,
    alignItems: "center",
    justifyContent: "center",
  },
  childFlagText: { fontSize: 10, fontFamily: Fonts.bodyBold, color: "white" },
  childName: { fontFamily: Fonts.bodyBold, fontSize: 14, color: Colors.text, marginTop: 10, marginBottom: 1 },
  childGrade: { fontFamily: Fonts.body, fontSize: 11, color: Colors.textMid, marginBottom: 9 },
  childStat: { flexDirection: "row", alignItems: "center", gap: 5 },
  childStatText: { fontFamily: Fonts.bodySemiBold, fontSize: 11, color: Colors.textMid },
  addChildCard: {
    width: 128,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 18,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    borderStyle: "dashed",
    gap: 8,
  },
  addChildIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  addChildLabel: { fontFamily: Fonts.bodyBold, fontSize: 12, color: Colors.textMid },
  feed: { gap: 9, marginBottom: 22 },
  feedItem: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 13,
    flexDirection: "row",
    gap: 11,
    overflow: "hidden",
  },
  feedStrip: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  feedIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  feedBody: { flex: 1 },
  feedRow1: { flexDirection: "row", justifyContent: "space-between", marginBottom: 3 },
  feedWho: { fontFamily: Fonts.bodyBold, fontSize: 13, color: Colors.text, flex: 1 },
  feedWith: { fontFamily: Fonts.bodyMedium, color: Colors.textMid },
  feedTime: { fontFamily: Fonts.body, fontSize: 11, color: Colors.sand },
  feedPreview: { fontFamily: Fonts.body, fontSize: 12, color: Colors.textMid, lineHeight: 17, marginBottom: 5 },
  actionsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 9, marginBottom: 22 },
  actionBtn: {
    width: "48%",
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 15,
    gap: 9,
  },
  actionIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: { fontFamily: Fonts.bodyBold, fontSize: 13, color: Colors.text },
  actionSub: { fontFamily: Fonts.body, fontSize: 11, color: Colors.textMid, lineHeight: 14 },
});
