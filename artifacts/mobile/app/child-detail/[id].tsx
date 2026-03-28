import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { Fonts } from "@/constants/typography";
import { Avatar } from "@/components/ui/Avatar";
import { useChildDetail } from "@/hooks/useApiData";
import { api } from "@/services/api";
import type { UsageStats } from "@/services/api";
import { useSubscriptionGate } from "@/hooks/useSubscriptionGate";

const trustLevelDescriptions = [
  "",
  "Full View — Parent sees all messages in real time",
  "Monitored — Parent sees message summaries and flags",
  "Flagged Only — Parent only sees flagged content",
  "Alerts Only — Parent only gets high-priority alerts",
  "Independent — Child manages own conversations",
];

const trustColors = [
  "",
  Colors.trustLevel1,
  Colors.trustLevel2,
  Colors.trustLevel3,
  Colors.trustLevel4,
  Colors.trustLevel5,
];

export default function ChildDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const childId = parseInt(id ?? "0");
  const insets = useSafeAreaInsets();
  const { child, conversations: childConvos, contacts: childContacts, updateTrustLevel, updateSettings } = useChildDetail(childId);

  const [trustLevel, setTrustLevel] = useState(child?.trustLevel ?? 1);
  const [faithMode, setFaithMode] = useState(child?.faithModeEnabled ?? false);
  const [isPaused, setIsPaused] = useState(child?.isPaused ?? false);
  const [screenTimeLimit, setScreenTimeLimit] = useState(child?.screenTimeLimitMinutes ?? 0);
  const [dailyMsgLimit, setDailyMsgLimit] = useState(child?.dailyMessageLimit ?? 0);
  const [cooldown, setCooldown] = useState(child?.cooldownSeconds ?? 0);
  const [usage, setUsage] = useState<UsageStats | null>(null);
  const { isSubscribed, requirePremium } = useSubscriptionGate();

  useEffect(() => {
    if (child) {
      setTrustLevel(child.trustLevel ?? 1);
      setFaithMode(child.faithModeEnabled ?? false);
      setIsPaused(child.isPaused ?? false);
      setScreenTimeLimit(child.screenTimeLimitMinutes ?? 0);
      setDailyMsgLimit(child.dailyMessageLimit ?? 0);
      setCooldown(child.cooldownSeconds ?? 0);
    }
  }, [child]);

  useFocusEffect(
    React.useCallback(() => {
      api.children.usage(childId).then(setUsage).catch(() => {});
    }, [childId])
  );

  if (!child) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={Colors.text} />
        </Pressable>
        <View style={styles.center}>
          <Text style={styles.notFound}>Child not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>{child.displayName}</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          <Avatar name={child.displayName} color={child.avatarColor} size={72} />
          <Text style={styles.profileName}>{child.displayName}</Text>
          <Text style={styles.profileGrade}>{child.grade}</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{child.messageCount}</Text>
              <Text style={styles.statLabel}>Messages</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: child.flagCount > 0 ? Colors.alert4 : Colors.primary }]}>
                {child.flagCount}
              </Text>
              <Text style={styles.statLabel}>Flags</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{childContacts.length}</Text>
              <Text style={styles.statLabel}>Contacts</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionLabel}>TRUST LEVEL</Text>
        <View style={styles.trustCard}>
          <View style={styles.trustHeader}>
            <View style={[styles.trustBadge, { backgroundColor: `${trustColors[trustLevel]}16` }]}>
              <Feather name="shield" size={18} color={trustColors[trustLevel]} />
            </View>
            <View style={styles.trustBody}>
              <Text style={styles.trustTitle}>Level {trustLevel}</Text>
              <Text style={styles.trustDesc}>{trustLevelDescriptions[trustLevel]}</Text>
            </View>
          </View>
          <View style={styles.trustSlider}>
            {[1, 2, 3, 4, 5].map((level) => (
              <Pressable
                key={level}
                style={[
                  styles.trustDot,
                  {
                    backgroundColor: level <= trustLevel ? trustColors[level] : Colors.border,
                  },
                  level === trustLevel && styles.trustDotActive,
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  setTrustLevel(level);
                  updateTrustLevel(level);
                }}
              >
                <Text style={[
                  styles.trustDotText,
                  level <= trustLevel && styles.trustDotTextActive,
                ]}>{level}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Text style={styles.sectionLabel}>SETTINGS</Text>
        <View style={styles.settingsGroup}>
          <View style={styles.settingsRow}>
            <View style={[styles.settingIcon, { backgroundColor: `${Colors.alert4}12` }]}>
              <Feather name="pause-circle" size={18} color={Colors.alert4} />
            </View>
            <View style={styles.settingBody}>
              <Text style={styles.settingLabel}>Pause Conversations</Text>
              <Text style={styles.settingSub}>Temporarily block all chats</Text>
            </View>
            <Switch
              value={isPaused}
              onValueChange={(v) => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setIsPaused(v);
                updateSettings({ isPaused: v });
              }}
              trackColor={{ false: Colors.border, true: Colors.alert4 }}
              thumbColor={Colors.white}
            />
          </View>
          <View style={styles.settingsRow}>
            <View style={[styles.settingIcon, { backgroundColor: `${Colors.faithGold}12` }]}>
              <Feather name="book-open" size={18} color={Colors.faithGold} />
            </View>
            <View style={styles.settingBody}>
              <Text style={styles.settingLabel}>Faith Mode</Text>
              <Text style={styles.settingSub}>Enable Christian values layer</Text>
            </View>
            {!isSubscribed && (
              <Pressable onPress={() => requirePremium("Faith Mode")} style={styles.premiumBadge}>
                <Feather name="star" size={12} color={Colors.primary} />
                <Text style={styles.premiumBadgeText}>Premium</Text>
              </Pressable>
            )}
            <Switch
              value={faithMode}
              onValueChange={(v) => {
                if (!isSubscribed) { requirePremium("Faith Mode"); return; }
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setFaithMode(v);
                updateSettings({ faithModeEnabled: v });
              }}
              trackColor={{ false: Colors.border, true: Colors.faithGold }}
              thumbColor={Colors.white}
            />
          </View>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={styles.sectionLabel}>ANTI-ADDICTION CONTROLS</Text>
          {!isSubscribed && (
            <Pressable onPress={() => requirePremium("Anti-Addiction Controls")} style={[styles.premiumBadge, { marginRight: 16, marginTop: 16 }]}>
              <Feather name="star" size={12} color={Colors.primary} />
              <Text style={styles.premiumBadgeText}>Premium</Text>
            </Pressable>
          )}
        </View>
        <View style={[styles.settingsGroup, !isSubscribed && { opacity: 0.5 }]}>
          {usage && (
            <View style={styles.usageBar}>
              <View style={styles.usageStat}>
                <Text style={styles.usageValue}>{usage.messagesToday}</Text>
                <Text style={styles.usageLabel}>Messages today</Text>
              </View>
              {dailyMsgLimit > 0 && (
                <View style={styles.usageStat}>
                  <Text style={[styles.usageValue, usage.messagesToday >= dailyMsgLimit ? { color: Colors.alert4 } : {}]}>
                    {Math.max(0, dailyMsgLimit - usage.messagesToday)}
                  </Text>
                  <Text style={styles.usageLabel}>Remaining</Text>
                </View>
              )}
            </View>
          )}

          <View style={styles.settingsRow}>
            <View style={[styles.settingIcon, { backgroundColor: `${Colors.accent}12` }]}>
              <Feather name="message-square" size={18} color={Colors.accent} />
            </View>
            <View style={styles.settingBody}>
              <Text style={styles.settingLabel}>Daily Message Limit</Text>
              <Text style={styles.settingSub}>
                {dailyMsgLimit === 0 ? "Unlimited" : `${dailyMsgLimit} messages per day`}
              </Text>
            </View>
          </View>
          <View style={styles.limitRow}>
            {[0, 25, 50, 100, 200].map((val) => (
              <Pressable
                key={val}
                style={[styles.limitChip, dailyMsgLimit === val && styles.limitChipActive]}
                onPress={() => {
                  if (!isSubscribed) { requirePremium("Anti-Addiction Controls"); return; }
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setDailyMsgLimit(val);
                  updateSettings({ dailyMessageLimit: val });
                }}
              >
                <Text style={[styles.limitChipText, dailyMsgLimit === val && styles.limitChipTextActive]}>
                  {val === 0 ? "∞" : val}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.settingsRow}>
            <View style={[styles.settingIcon, { backgroundColor: `${Colors.primary}12` }]}>
              <Feather name="clock" size={18} color={Colors.primary} />
            </View>
            <View style={styles.settingBody}>
              <Text style={styles.settingLabel}>Cooldown Between Messages</Text>
              <Text style={styles.settingSub}>
                {cooldown === 0 ? "No cooldown" : `${cooldown} second wait`}
              </Text>
            </View>
          </View>
          <View style={styles.limitRow}>
            {[0, 10, 30, 60, 120].map((val) => (
              <Pressable
                key={val}
                style={[styles.limitChip, cooldown === val && styles.limitChipActive]}
                onPress={() => {
                  if (!isSubscribed) { requirePremium("Anti-Addiction Controls"); return; }
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setCooldown(val);
                  updateSettings({ cooldownSeconds: val });
                }}
              >
                <Text style={[styles.limitChipText, cooldown === val && styles.limitChipTextActive]}>
                  {val === 0 ? "Off" : val < 60 ? `${val}s` : `${val / 60}m`}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.settingsRow}>
            <View style={[styles.settingIcon, { backgroundColor: `${Colors.alert3}12` }]}>
              <Feather name="watch" size={18} color={Colors.alert3} />
            </View>
            <View style={styles.settingBody}>
              <Text style={styles.settingLabel}>Screen Time Limit</Text>
              <Text style={styles.settingSub}>
                {screenTimeLimit === 0 ? "Unlimited" : `${screenTimeLimit} min per day`}
              </Text>
            </View>
          </View>
          <View style={styles.limitRow}>
            {[0, 30, 60, 120, 240].map((val) => (
              <Pressable
                key={val}
                style={[styles.limitChip, screenTimeLimit === val && styles.limitChipActive]}
                onPress={() => {
                  if (!isSubscribed) { requirePremium("Anti-Addiction Controls"); return; }
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setScreenTimeLimit(val);
                  updateSettings({ screenTimeLimitMinutes: val });
                }}
              >
                <Text style={[styles.limitChipText, screenTimeLimit === val && styles.limitChipTextActive]}>
                  {val === 0 ? "∞" : val < 60 ? `${val}m` : `${val / 60}h`}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Text style={styles.sectionLabel}>CONTACTS ({childContacts.length})</Text>
        <View style={styles.contactsList}>
          {childContacts.map((contact) => (
            <View key={contact.id} style={styles.contactRow}>
              <Avatar name={contact.contactName} color={contact.avatarColor} size={36} />
              <View style={styles.contactBody}>
                <Text style={styles.contactName}>{contact.contactName}</Text>
                <Text style={styles.contactStatus}>
                  {contact.approvedByParent ? "Approved" : "Pending"}
                </Text>
              </View>
              <Feather name="chevron-right" size={16} color={Colors.sand} />
            </View>
          ))}
        </View>

        <Text style={styles.sectionLabel}>RECENT CONVERSATIONS</Text>
        <View style={styles.convoList}>
          {childConvos.map((convo) => (
            <Pressable
              key={convo.id}
              style={styles.convoRow}
              onPress={() => router.push(`/conversation/${convo.id}`)}
            >
              <Avatar name={convo.contactName} color={convo.contactAvatarColor} size={36} />
              <View style={styles.convoBody}>
                <Text style={styles.convoName}>{convo.contactName}</Text>
                <Text style={styles.convoPreview} numberOfLines={1}>{convo.lastMessage}</Text>
              </View>
              <Text style={styles.convoTime}>{convo.lastMessageTime}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  notFound: { fontFamily: Fonts.body, fontSize: 16, color: Colors.textMid },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontFamily: Fonts.heading, fontSize: 20, color: Colors.text },
  profileSection: {
    alignItems: "center",
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    padding: 24,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginBottom: 20,
    gap: 6,
  },
  profileName: { fontFamily: Fonts.heading, fontSize: 24, color: Colors.text },
  profileGrade: { fontFamily: Fonts.body, fontSize: 14, color: Colors.textMid },
  statsRow: {
    flexDirection: "row",
    marginTop: 12,
    gap: 0,
  },
  statItem: { flex: 1, alignItems: "center", gap: 2 },
  statValue: { fontFamily: Fonts.heading, fontSize: 22, color: Colors.text },
  statLabel: { fontFamily: Fonts.body, fontSize: 12, color: Colors.textMid },
  statDivider: { width: 1, backgroundColor: Colors.border, marginVertical: 4 },
  sectionLabel: {
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 0.6,
    color: Colors.textMid,
    paddingHorizontal: 20,
    marginBottom: 8,
    marginTop: 4,
  },
  trustCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: 18,
    marginBottom: 20,
  },
  trustHeader: { flexDirection: "row", gap: 12, marginBottom: 16 },
  trustBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  trustBody: { flex: 1 },
  trustTitle: { fontFamily: Fonts.bodyBold, fontSize: 16, color: Colors.text },
  trustDesc: { fontFamily: Fonts.body, fontSize: 12, color: Colors.textMid, lineHeight: 17, marginTop: 2 },
  trustSlider: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  trustDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  trustDotActive: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: Colors.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  trustDotText: { fontFamily: Fonts.bodyBold, fontSize: 14, color: Colors.white },
  trustDotTextActive: { color: Colors.white },
  settingsGroup: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginBottom: 20,
    overflow: "hidden",
  },
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  settingBody: { flex: 1 },
  settingLabel: { fontFamily: Fonts.bodySemiBold, fontSize: 14, color: Colors.text },
  settingSub: { fontFamily: Fonts.body, fontSize: 12, color: Colors.textMid, marginTop: 1 },
  contactsList: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginBottom: 20,
    overflow: "hidden",
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface,
  },
  usageBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface,
  },
  usageStat: { alignItems: "center", gap: 2 },
  usageValue: { fontFamily: Fonts.heading, fontSize: 24, color: Colors.text },
  usageLabel: { fontFamily: Fonts.body, fontSize: 11, color: Colors.textMid },
  limitRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface,
  },
  limitChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: Colors.surface,
    alignItems: "center",
  },
  limitChipActive: {
    backgroundColor: Colors.primary,
  },
  limitChipText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 13,
    color: Colors.textMid,
  },
  limitChipTextActive: {
    color: Colors.white,
  },
  contactBody: { flex: 1 },
  contactName: { fontFamily: Fonts.bodySemiBold, fontSize: 14, color: Colors.text },
  contactStatus: { fontFamily: Fonts.body, fontSize: 12, color: Colors.primary },
  convoList: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginBottom: 20,
    overflow: "hidden",
  },
  convoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface,
  },
  convoBody: { flex: 1 },
  convoName: { fontFamily: Fonts.bodySemiBold, fontSize: 14, color: Colors.text },
  convoPreview: { fontFamily: Fonts.body, fontSize: 12, color: Colors.textMid, marginTop: 1 },
  convoTime: { fontFamily: Fonts.body, fontSize: 11, color: Colors.sand },
  premiumBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: `${Colors.primary}12`,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  premiumBadgeText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 11,
    color: Colors.primary,
  },
});
