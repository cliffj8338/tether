import React, { useState } from "react";
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
import * as Clipboard from "expo-clipboard";
import Colors from "@/constants/colors";
import { Fonts } from "@/constants/typography";
import { useAuth } from "@/context/AuthContext";
import { TetherButton } from "@/components/ui/TetherButton";
import { TetherInput } from "@/components/ui/TetherInput";
import { api } from "@/services/api";

const AVATAR_COLORS = [
  "#7B8EC4",
  "#E8A87C",
  "#85CDCA",
  "#D4A5A5",
  "#9ED2C6",
  "#B8A9C9",
  "#F6B880",
  "#88C9A1",
];

export default function AddChildScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  React.useEffect(() => {
    if (user && user.role !== "parent") {
      router.back();
    }
  }, [user]);

  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState("");
  const [childGrade, setChildGrade] = useState("");
  const [childPin, setChildPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [addedChild, setAddedChild] = useState<{ displayName: string; avatarColor: string } | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);

  const copyFamilyCode = async () => {
    if (user?.familyCode) {
      await Clipboard.setStringAsync(user.familyCode);
      setCodeCopied(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  const handleAddChild = async () => {
    if (!childName.trim()) {
      Alert.alert("Missing Name", "Please enter your child's name.");
      return;
    }
    if (!childPin.trim()) {
      Alert.alert("Missing PIN", "Please create a PIN for your child.");
      return;
    }
    if (!/^\d{4,6}$/.test(childPin.trim())) {
      Alert.alert("Invalid PIN", "PIN must be 4-6 digits.");
      return;
    }
    if (childPin !== confirmPin) {
      Alert.alert("PIN Mismatch", "The PINs don't match. Please try again.");
      return;
    }
    const ageNum = Number(childAge);
    if (childAge && (!Number.isInteger(ageNum) || ageNum < 3 || ageNum > 17)) {
      Alert.alert("Invalid Age", "Age must be a whole number between 3 and 17.");
      return;
    }

    setLoading(true);
    try {
      const child = await api.children.add({
        displayName: childName.trim(),
        pin: childPin.trim(),
        age: childAge ? Number(childAge) : undefined,
        grade: childGrade.trim() || undefined,
      });
      setAddedChild({ displayName: child.displayName, avatarColor: child.avatarColor });
      setSuccess(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Could not add child. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAnother = () => {
    setChildName("");
    setChildAge("");
    setChildGrade("");
    setChildPin("");
    setConfirmPin("");
    setSuccess(false);
    setAddedChild(null);
  };

  if (success && addedChild) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <View style={{ width: 36 }} />
          <Text style={styles.headerTitle}>Child Added!</Text>
          <View style={{ width: 36 }} />
        </View>

        <View style={styles.successContent}>
          <View style={[styles.successAvatar, { backgroundColor: addedChild.avatarColor }]}>
            <Text style={styles.successAvatarText}>
              {addedChild.displayName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.successName}>{addedChild.displayName}</Text>
          <Text style={styles.successSub}>is now part of your family on Tether</Text>

          <View style={styles.nextStepsCard}>
            <Text style={styles.nextStepsTitle}>How your child can log in</Text>
            <View style={styles.nextStep}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>1</Text>
              </View>
              <View style={styles.stepBody}>
                <Text style={styles.stepText}>Open Tether on their device</Text>
              </View>
            </View>
            <View style={styles.nextStep}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>2</Text>
              </View>
              <View style={styles.stepBody}>
                <Text style={styles.stepText}>Tap "I'm a Kid" then "Log In with Family Code"</Text>
              </View>
            </View>
            <View style={styles.nextStep}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>3</Text>
              </View>
              <View style={styles.stepBody}>
                <Text style={styles.stepText}>
                  Enter code <Text style={styles.codeInline}>{user?.familyCode}</Text>, their name, and PIN
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.successActions}>
            <TetherButton title="Add Another Child" onPress={handleAddAnother} variant="secondary" />
            <View style={{ height: 10 }} />
            <TetherButton title="Go to Dashboard" onPress={() => router.back()} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.closeBtn}>
          <Feather name="x" size={22} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Add Child</Text>
        <View style={{ width: 36 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={insets.top + 60}
      >
        <ScrollView
          style={styles.body}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {user?.familyCode && (
            <Pressable style={styles.familyCodeCard} onPress={copyFamilyCode}>
              <View style={styles.familyCodeHeader}>
                <View style={[styles.familyCodeIcon, { backgroundColor: `${Colors.accent}16` }]}>
                  <Feather name="link" size={18} color={Colors.accent} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.familyCodeLabel}>Your Family Code</Text>
                  <Text style={styles.familyCodeSub}>Kids can also join using this code</Text>
                </View>
              </View>
              <View style={styles.familyCodeDisplay}>
                <Text style={styles.familyCodeText}>{user.familyCode}</Text>
                <View style={styles.copyBtn}>
                  <Feather
                    name={codeCopied ? "check" : "copy"}
                    size={16}
                    color={codeCopied ? Colors.primary : Colors.textMid}
                  />
                  <Text style={[styles.copyText, codeCopied && { color: Colors.primary }]}>
                    {codeCopied ? "Copied!" : "Copy"}
                  </Text>
                </View>
              </View>
            </Pressable>
          )}

          <Text style={styles.sectionTitle}>Child's Information</Text>

          <TetherInput
            label="Child's Name"
            placeholder="e.g. Emma"
            value={childName}
            onChangeText={setChildName}
            icon="smile"
            autoCapitalize="words"
          />

          <View style={styles.rowInputs}>
            <View style={{ flex: 1 }}>
              <TetherInput
                label="Age"
                placeholder="e.g. 10"
                value={childAge}
                onChangeText={setChildAge}
                icon="calendar"
                keyboardType="numeric"
              />
            </View>
            <View style={{ flex: 1 }}>
              <TetherInput
                label="Grade"
                placeholder="e.g. 4th"
                value={childGrade}
                onChangeText={setChildGrade}
                icon="book"
                autoCapitalize="words"
              />
            </View>
          </View>

          <Text style={styles.sectionTitle}>Create Their PIN</Text>
          <Text style={styles.sectionSub}>
            Your child will use this PIN to log in. Choose something they'll remember but others won't guess.
          </Text>

          <TetherInput
            label="PIN"
            placeholder="4-6 digit PIN"
            value={childPin}
            onChangeText={(t) => setChildPin(t.replace(/[^0-9]/g, "").slice(0, 6))}
            secureTextEntry
            keyboardType="numeric"
            icon="lock"
          />

          <TetherInput
            label="Confirm PIN"
            placeholder="Re-enter PIN"
            value={confirmPin}
            onChangeText={(t) => setConfirmPin(t.replace(/[^0-9]/g, "").slice(0, 6))}
            secureTextEntry
            keyboardType="numeric"
            icon="lock"
          />

          <View style={{ marginTop: 16 }}>
            <TetherButton title="Add Child" onPress={handleAddChild} loading={loading} />
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
  familyCodeCard: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 18,
    padding: 16,
    marginBottom: 24,
  },
  familyCodeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  familyCodeIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  familyCodeLabel: {
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
    color: Colors.text,
  },
  familyCodeSub: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.textMid,
    marginTop: 1,
  },
  familyCodeDisplay: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  familyCodeText: {
    fontFamily: Fonts.heading,
    fontSize: 22,
    color: Colors.accent,
    letterSpacing: 2,
  },
  copyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  copyText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 13,
    color: Colors.textMid,
  },
  sectionTitle: {
    fontFamily: Fonts.bodyBold,
    fontSize: 15,
    color: Colors.text,
    marginBottom: 4,
  },
  sectionSub: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.textMid,
    lineHeight: 19,
    marginBottom: 12,
  },
  rowInputs: {
    flexDirection: "row",
    gap: 12,
  },
  successContent: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  successAvatar: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  successAvatarText: {
    fontFamily: Fonts.heading,
    fontSize: 32,
    color: Colors.white,
  },
  successName: {
    fontFamily: Fonts.heading,
    fontSize: 24,
    color: Colors.text,
    marginBottom: 4,
  },
  successSub: {
    fontFamily: Fonts.body,
    fontSize: 15,
    color: Colors.textMid,
    marginBottom: 28,
  },
  nextStepsCard: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 18,
    padding: 18,
    width: "100%",
    marginBottom: 28,
  },
  nextStepsTitle: {
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
    color: Colors.text,
    marginBottom: 14,
  },
  nextStep: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 12,
  },
  stepNum: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: `${Colors.primary}16`,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
    color: Colors.primary,
  },
  stepBody: {
    flex: 1,
    paddingTop: 2,
  },
  stepText: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.textMid,
    lineHeight: 20,
  },
  codeInline: {
    fontFamily: Fonts.bodyBold,
    color: Colors.accent,
  },
  successActions: {
    width: "100%",
  },
});
