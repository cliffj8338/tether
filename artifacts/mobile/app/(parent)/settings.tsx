import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, Alert, TextInput, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { Fonts } from "@/constants/typography";
import { useAuth } from "@/context/AuthContext";
import { Avatar } from "@/components/ui/Avatar";
import { api } from "@/services/api";
import { useSubscription } from "@/lib/revenuecat";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout, updateUser } = useAuth();
  const { isSubscribed, offerings, restore, isRestoring } = useSubscription();
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [savingPhone, setSavingPhone] = useState(false);
  const [phoneError, setPhoneError] = useState("");

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

  const toggleFaithMode = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    updateUser({ faithModeEnabled: !user?.faithModeEnabled });
  };

  const savePhone = useCallback(async () => {
    const cleaned = phone.replace(/[^+\d]/g, "");
    if (cleaned && !/^\+?\d{10,15}$/.test(cleaned)) {
      setPhoneError("Enter a valid phone number (e.g. +15551234567)");
      return;
    }
    setPhoneError("");
    setSavingPhone(true);
    try {
      const updated = await api.auth.updateProfile({ phone: cleaned || "" });
      updateUser({ phone: updated.phone });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      setPhoneError("Failed to save phone number");
    } finally {
      setSavingPhone(false);
    }
  }, [phone, updateUser]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          <Avatar name={user?.displayName ?? "P"} color={Colors.primary} size={56} />
          <View style={styles.profileBody}>
            <Text style={styles.profileName}>{user?.displayName}</Text>
            <Text style={styles.profileEmail}>{user?.email ?? "Parent Account"}</Text>
          </View>
          <Pressable style={styles.editBtn}>
            <Feather name="edit-2" size={16} color={Colors.accent} />
          </Pressable>
        </View>

        <Text style={styles.sectionLabel}>ACCOUNT</Text>
        <View style={styles.group}>
          <View style={styles.row}>
            <View style={[styles.rowIcon, { backgroundColor: `${Colors.primary}16` }]}>
              <Feather name="phone" size={18} color={Colors.primary} />
            </View>
            <View style={styles.rowBody}>
              <Text style={styles.rowLabel}>Phone Number</Text>
              <Text style={styles.rowSub}>For emergency SMS alerts (Level 4-5)</Text>
            </View>
          </View>
          <View style={styles.phoneRow}>
            <TextInput
              style={styles.phoneInput}
              placeholder="+1 (555) 123-4567"
              placeholderTextColor={Colors.sand}
              value={phone}
              onChangeText={(t) => { setPhone(t); setPhoneError(""); }}
              keyboardType="phone-pad"
              autoComplete="tel"
            />
            <Pressable
              style={[styles.phoneSaveBtn, savingPhone && { opacity: 0.6 }]}
              onPress={savePhone}
              disabled={savingPhone}
            >
              {savingPhone ? (
                <ActivityIndicator size="small" color={Colors.white} />
              ) : (
                <Text style={styles.phoneSaveText}>Save</Text>
              )}
            </Pressable>
          </View>
          {phoneError ? <Text style={styles.phoneError}>{phoneError}</Text> : null}
          <SettingsRow icon="bell" label="Notifications" />
          <SettingsRow icon="lock" label="Privacy & Security" />
        </View>

        <Text style={styles.sectionLabel}>SUBSCRIPTION</Text>
        <View style={styles.group}>
          <View style={styles.row}>
            <View style={[styles.rowIcon, { backgroundColor: `${Colors.primary}16` }]}>
              <Feather name="credit-card" size={18} color={Colors.primary} />
            </View>
            <View style={styles.rowBody}>
              <Text style={styles.rowLabel}>Plan</Text>
              <Text style={styles.rowSub}>
                {isSubscribed ? "Tether Family — Active" : "No active subscription"}
              </Text>
            </View>
            {isSubscribed ? (
              <View style={styles.activeBadge}>
                <Text style={styles.activeBadgeText}>Active</Text>
              </View>
            ) : null}
          </View>
          {!isSubscribed ? (
            <Pressable
              style={styles.subscribeBtn}
              onPress={() => router.push("/paywall" as any)}
            >
              <Feather name="star" size={16} color={Colors.white} />
              <Text style={styles.subscribeBtnText}>Subscribe Now</Text>
            </Pressable>
          ) : null}
          <Pressable
            style={styles.row}
            onPress={async () => {
              try {
                await restore();
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              } catch {}
            }}
            disabled={isRestoring}
          >
            <View style={[styles.rowIcon, { backgroundColor: Colors.surface }]}>
              <Feather name="refresh-cw" size={18} color={Colors.textMid} />
            </View>
            <View style={styles.rowBody}>
              <Text style={styles.rowLabel}>Restore Purchases</Text>
              {isRestoring ? <ActivityIndicator size="small" style={{ marginTop: 4 }} /> : null}
            </View>
          </Pressable>
        </View>

        <Text style={styles.sectionLabel}>CONTENT FILTERS</Text>
        <View style={styles.group}>
          <SettingsRow icon="shield" label="Filter Settings" />
          <SettingsRow icon="alert-triangle" label="Alert Preferences" />
          <View style={styles.row}>
            <View style={[styles.rowIcon, { backgroundColor: `${Colors.faithGold}16` }]}>
              <Feather name="book-open" size={18} color={Colors.faithGold} />
            </View>
            <View style={styles.rowBody}>
              <Text style={styles.rowLabel}>Faith Mode</Text>
              <Text style={styles.rowSub}>Christian values layer</Text>
            </View>
            <Switch
              value={!!user?.faithModeEnabled}
              onValueChange={toggleFaithMode}
              trackColor={{ false: Colors.border, true: Colors.faithGold }}
              thumbColor={Colors.white}
            />
          </View>
        </View>

        <Text style={styles.sectionLabel}>SUPPORT</Text>
        <View style={styles.group}>
          <SettingsRow icon="help-circle" label="Help & FAQ" />
          <SettingsRow icon="file-text" label="Terms of Service" />
          <SettingsRow icon="shield" label="Privacy Policy" />
        </View>

        <Pressable style={styles.logoutBtn} onPress={handleLogout}>
          <Feather name="log-out" size={18} color={Colors.alert4} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </Pressable>

        <Text style={styles.version}>Tether v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

function SettingsRow({ icon, label }: { icon: keyof typeof Feather.glyphMap; label: string }) {
  return (
    <Pressable style={styles.row}>
      <View style={[styles.rowIcon, { backgroundColor: Colors.surface }]}>
        <Feather name={icon} size={18} color={Colors.textMid} />
      </View>
      <View style={styles.rowBody}>
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <Feather name="chevron-right" size={18} color={Colors.sand} />
    </Pressable>
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    padding: 18,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginBottom: 24,
    gap: 14,
  },
  profileBody: { flex: 1 },
  profileName: { fontFamily: Fonts.bodyBold, fontSize: 18, color: Colors.text },
  profileEmail: { fontFamily: Fonts.body, fontSize: 13, color: Colors.textMid, marginTop: 2 },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: `${Colors.accent}14`,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionLabel: {
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 0.6,
    color: Colors.textMid,
    paddingHorizontal: 20,
    marginBottom: 8,
    marginTop: 8,
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
  rowBody: { flex: 1 },
  rowLabel: { fontFamily: Fonts.bodySemiBold, fontSize: 14, color: Colors.text },
  rowSub: { fontFamily: Fonts.body, fontSize: 12, color: Colors.textMid, marginTop: 1 },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    paddingBottom: 14,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface,
  },
  phoneInput: {
    flex: 1,
    fontFamily: Fonts.body,
    fontSize: 15,
    color: Colors.text,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  phoneSaveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  phoneSaveText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
    color: Colors.white,
  },
  phoneError: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.alert4,
    paddingHorizontal: 14,
    paddingBottom: 10,
  },
  activeBadge: {
    backgroundColor: `${Colors.primary}16`,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  activeBadgeText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    color: Colors.primary,
  },
  subscribeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 14,
    marginVertical: 10,
    paddingVertical: 12,
    backgroundColor: Colors.primary,
    borderRadius: 12,
  },
  subscribeBtnText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
    color: Colors.white,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: `${Colors.alert4}08`,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: `${Colors.alert4}20`,
  },
  logoutText: { fontFamily: Fonts.bodyBold, fontSize: 15, color: Colors.alert4 },
  version: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.sand,
    textAlign: "center",
    marginTop: 20,
  },
});
