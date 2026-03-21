import React from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { Fonts } from "@/constants/typography";
import { Avatar } from "@/components/ui/Avatar";
import { useDemoData } from "@/hooks/useDemoData";

export default function CommunityScreen() {
  const insets = useSafeAreaInsets();
  const { contacts, children } = useDemoData();

  const pendingContacts = contacts.filter((c) => !c.approvedByParent);
  const approvedContacts = contacts.filter((c) => c.approvedByParent);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Community</Text>
        <Pressable style={styles.addBtn}>
          <Feather name="plus" size={20} color={Colors.white} />
        </Pressable>
      </View>

      <FlatList
        data={[
          ...(pendingContacts.length > 0 ? [{ type: "pending-header" as const }] : []),
          ...pendingContacts.map((c) => ({ type: "pending" as const, ...c })),
          { type: "approved-header" as const },
          ...approvedContacts.map((c) => ({ type: "approved" as const, ...c })),
        ]}
        keyExtractor={(item, i) => `${item.type}-${i}`}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          if (item.type === "pending-header") {
            return (
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionDot, { backgroundColor: Colors.alert3 }]} />
                <Text style={styles.sectionTitle}>Pending Approval</Text>
                <Text style={styles.sectionCount}>{pendingContacts.length}</Text>
              </View>
            );
          }
          if (item.type === "approved-header") {
            return (
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionDot, { backgroundColor: Colors.primary }]} />
                <Text style={styles.sectionTitle}>Approved Contacts</Text>
                <Text style={styles.sectionCount}>{approvedContacts.length}</Text>
              </View>
            );
          }

          const contact = item as typeof item & { contactName: string; childId: number; approvedByParent: boolean; parentIntroSent: boolean; avatarColor: string };
          const childName = children.find((c) => c.id === contact.childId)?.displayName ?? "";

          return (
            <Pressable
              style={styles.contactCard}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            >
              <Avatar name={contact.contactName} color={contact.avatarColor} size={44} />
              <View style={styles.contactBody}>
                <Text style={styles.contactName}>{contact.contactName}</Text>
                <Text style={styles.contactChild}>{childName}'s contact</Text>
                {contact.parentIntroSent && (
                  <View style={styles.introTag}>
                    <Feather name="check" size={10} color={Colors.primaryDark} />
                    <Text style={styles.introText}>Parent intro sent</Text>
                  </View>
                )}
              </View>
              {!contact.approvedByParent ? (
                <View style={styles.approveActions}>
                  <Pressable
                    style={styles.approveBtn}
                    onPress={() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)}
                  >
                    <Feather name="check" size={16} color={Colors.white} />
                  </Pressable>
                  <Pressable style={styles.rejectBtn}>
                    <Feather name="x" size={16} color={Colors.alert4} />
                  </Pressable>
                </View>
              ) : (
                <Feather name="chevron-right" size={18} color={Colors.sand} />
              )}
            </Pressable>
          );
        }}
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
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sectionTitle: {
    fontFamily: Fonts.bodyBold,
    fontSize: 13,
    color: Colors.text,
    flex: 1,
  },
  sectionCount: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 12,
    color: Colors.textMid,
    backgroundColor: Colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 12,
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  contactBody: { flex: 1 },
  contactName: { fontFamily: Fonts.bodyBold, fontSize: 15, color: Colors.text },
  contactChild: { fontFamily: Fonts.body, fontSize: 12, color: Colors.textMid, marginTop: 1 },
  introTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
    backgroundColor: `${Colors.primary}16`,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  introText: { fontFamily: Fonts.bodySemiBold, fontSize: 10, color: Colors.primaryDark },
  approveActions: { flexDirection: "row", gap: 8 },
  approveBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  rejectBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: `${Colors.alert4}12`,
    borderWidth: 1.5,
    borderColor: `${Colors.alert4}30`,
    alignItems: "center",
    justifyContent: "center",
  },
});
