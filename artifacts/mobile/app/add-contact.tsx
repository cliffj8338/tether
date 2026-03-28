import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { Fonts } from "@/constants/typography";
import { useAuth } from "@/context/AuthContext";
import { TetherButton } from "@/components/ui/TetherButton";
import { TetherInput } from "@/components/ui/TetherInput";
import { api } from "@/services/api";
import type { Child } from "@/services/api";

export default function AddContactScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
  const [contactName, setContactName] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingChildren, setLoadingChildren] = useState(true);

  useEffect(() => {
    if (user && user.role !== "parent") {
      router.back();
      return;
    }
    api.children.list().then((kids) => {
      setChildren(kids);
      if (kids.length === 1) setSelectedChildId(kids[0].id);
      setLoadingChildren(false);
    }).catch(() => setLoadingChildren(false));
  }, [user]);

  const handleAddContact = async () => {
    if (!selectedChildId) {
      Alert.alert("Select a Child", "Please choose which child this contact is for.");
      return;
    }
    if (!contactName.trim()) {
      Alert.alert("Missing Name", "Please enter the contact's name.");
      return;
    }

    setLoading(true);
    try {
      await api.contacts.add({
        childId: selectedChildId,
        contactName: contactName.trim(),
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        "Contact Added",
        `${contactName.trim()} has been added as a pending contact. You can approve them from the Community tab.`,
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (err: any) {
      Alert.alert("Error", err.message || "Could not add contact. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.closeBtn}>
          <Feather name="x" size={22} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Add Contact</Text>
        <View style={{ width: 36 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.body}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.infoCard}>
            <View style={[styles.infoIcon, { backgroundColor: `${Colors.primary}16` }]}>
              <Feather name="shield" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.infoText}>
              New contacts start as pending. You'll need to approve them before your child can start chatting.
            </Text>
          </View>

          {children.length > 1 && (
            <>
              <Text style={styles.sectionTitle}>For which child?</Text>
              <View style={styles.childChips}>
                {children.map((child) => (
                  <Pressable
                    key={child.id}
                    style={[
                      styles.childChip,
                      selectedChildId === child.id && styles.childChipActive,
                    ]}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setSelectedChildId(child.id);
                    }}
                  >
                    <Text
                      style={[
                        styles.childChipText,
                        selectedChildId === child.id && styles.childChipTextActive,
                      ]}
                    >
                      {child.displayName}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </>
          )}

          {children.length === 1 && (
            <View style={styles.selectedChildRow}>
              <Feather name="user" size={16} color={Colors.primary} />
              <Text style={styles.selectedChildText}>
                Adding contact for <Text style={{ fontFamily: Fonts.bodyBold }}>{children[0].displayName}</Text>
              </Text>
            </View>
          )}

          <Text style={styles.sectionTitle}>Contact Name</Text>
          <TetherInput
            label=""
            placeholder="e.g. Olivia, Jake, Mrs. Smith"
            value={contactName}
            onChangeText={setContactName}
            icon="user-plus"
            autoCapitalize="words"
          />

          <View style={{ marginTop: 20 }}>
            <TetherButton
              title="Add Contact"
              onPress={handleAddContact}
              loading={loading}
              disabled={!selectedChildId || !contactName.trim()}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: "rgba(255,255,255,0.96)",
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: Fonts.heading,
    fontSize: 18,
    color: Colors.text,
  },
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: `${Colors.primary}08`,
    borderWidth: 1,
    borderColor: `${Colors.primary}20`,
    borderRadius: 14,
    padding: 14,
    gap: 12,
    marginBottom: 24,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.textMid,
    lineHeight: 19,
  },
  sectionTitle: {
    fontFamily: Fonts.bodyBold,
    fontSize: 15,
    color: Colors.text,
    marginBottom: 10,
  },
  childChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 24,
  },
  childChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  childChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  childChipText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 14,
    color: Colors.text,
  },
  childChipTextActive: {
    color: Colors.white,
  },
  selectedChildRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
    paddingVertical: 8,
  },
  selectedChildText: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.textMid,
  },
});
