import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Pressable,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { Fonts } from "@/constants/typography";
import { useAuth } from "@/context/AuthContext";
import { TetherButton } from "@/components/ui/TetherButton";
import { TetherInput } from "@/components/ui/TetherInput";
import { api } from "@/services/api";

const { width } = Dimensions.get("window");

const slides = [
  {
    icon: "shield" as const,
    title: "Safe Messaging\nfor Kids",
    subtitle: "Every message is scanned before delivery. Parents stay informed without reading every word.",
    color: Colors.primary,
  },
  {
    icon: "eye" as const,
    title: "Trust Levels\nThat Grow",
    subtitle: "Start supervised, earn independence. Five levels from full view to fully independent.",
    color: Colors.accent,
  },
  {
    icon: "users" as const,
    title: "Parent-Approved\nContacts Only",
    subtitle: "Kids can only chat with contacts you approve. Parent introductions keep everyone connected.",
    color: Colors.primaryDark,
  },
];

type OnboardingStep = "slides" | "role" | "parent-signup" | "parent-login" | "child-method" | "child-login-code" | "child-login-email" | "child-join";

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const { login, setOnboarded } = useAuth();
  const flatListRef = useRef<FlatList>(null);

  const [step, setStep] = useState<OnboardingStep>("slides");
  const [slideIndex, setSlideIndex] = useState(0);

  const [parentName, setParentName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [childParentEmail, setChildParentEmail] = useState("");
  const [familyCode, setFamilyCode] = useState("");
  const [childName, setChildName] = useState("");
  const [childPin, setChildPin] = useState("");
  const [childAge, setChildAge] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!parentName.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Missing Info", "Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const result = await api.auth.register({
        email: email.trim(),
        displayName: parentName.trim(),
        password: password.trim(),
      });
      await login(result.user, result.token);
      await setOnboarded();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/(parent)/dashboard");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing Info", "Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const result = await api.auth.login({
        email: email.trim(),
        password: password.trim(),
      });
      await login(result.user, result.token);
      await setOnboarded();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/(parent)/dashboard");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChildLoginWithCode = async () => {
    if (!familyCode.trim() || !childName.trim() || !childPin.trim()) {
      Alert.alert("Missing Info", "Please fill in all fields.");
      return;
    }
    if (!/^\d{4,6}$/.test(childPin.trim())) {
      Alert.alert("Invalid PIN", "PIN must be 4-6 digits.");
      return;
    }
    setLoading(true);
    try {
      const result = await api.auth.childLogin({
        familyCode: familyCode.trim().toUpperCase(),
        childName: childName.trim(),
        pin: childPin.trim(),
      });
      await login(result.user, result.token);
      await setOnboarded();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/(child)/home");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Invalid family code, name, or PIN.");
    } finally {
      setLoading(false);
    }
  };

  const handleChildLoginWithEmail = async () => {
    if (!childParentEmail.trim() || !childName.trim() || !childPin.trim()) {
      Alert.alert("Missing Info", "Please fill in all fields.");
      return;
    }
    if (!/^\d{4,6}$/.test(childPin.trim())) {
      Alert.alert("Invalid PIN", "PIN must be 4-6 digits.");
      return;
    }
    setLoading(true);
    try {
      const result = await api.auth.childLogin({
        parentEmail: childParentEmail.trim(),
        childName: childName.trim(),
        pin: childPin.trim(),
      });
      await login(result.user, result.token);
      await setOnboarded();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/(child)/home");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Invalid PIN or account not found.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinFamily = async () => {
    if (!familyCode.trim() || !childName.trim() || !childPin.trim()) {
      Alert.alert("Missing Info", "Please enter your family code, name, and create a PIN.");
      return;
    }
    if (!/^\d{4,6}$/.test(childPin.trim())) {
      Alert.alert("Invalid PIN", "PIN must be 4-6 digits.");
      return;
    }
    if (childAge && (isNaN(parseInt(childAge)) || parseInt(childAge) < 3 || parseInt(childAge) > 17)) {
      Alert.alert("Invalid Age", "Age must be between 3 and 17.");
      return;
    }
    setLoading(true);
    try {
      const result = await api.auth.joinFamily({
        familyCode: familyCode.trim().toUpperCase(),
        childName: childName.trim(),
        pin: childPin.trim(),
        age: childAge ? parseInt(childAge) : undefined,
      });
      await login(result.user, result.token);
      await setOnboarded();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/(child)/home");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Could not join family. Check your code and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (step === "slides") {
    return (
      <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + 20 }]}>
        <FlatList
          ref={flatListRef}
          data={slides}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            setSlideIndex(index);
          }}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <View style={[styles.slide, { width }]}>
              <View style={[styles.slideIconWrap, { backgroundColor: `${item.color}16` }]}>
                <Feather name={item.icon} size={48} color={item.color} />
              </View>
              <Text style={styles.slideTitle}>{item.title}</Text>
              <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
            </View>
          )}
        />
        <View style={styles.dotsRow}>
          {slides.map((_, i) => (
            <View key={i} style={[styles.dot, i === slideIndex && styles.dotActive]} />
          ))}
        </View>
        <View style={styles.slideActions}>
          <TetherButton title="Get Started" onPress={() => setStep("role")} />
        </View>
      </View>
    );
  }

  if (step === "role") {
    return (
      <View style={[styles.container, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.roleContent}>
          <Text style={styles.roleTitle}>Who are you?</Text>
          <Text style={styles.roleSubtitle}>Select your role to get started</Text>

          <Pressable
            style={styles.roleCard}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setStep("parent-signup");
            }}
          >
            <View style={[styles.roleIconWrap, { backgroundColor: `${Colors.primary}16` }]}>
              <Feather name="user" size={28} color={Colors.primary} />
            </View>
            <View style={styles.roleCardBody}>
              <Text style={styles.roleCardTitle}>I'm a Parent</Text>
              <Text style={styles.roleCardSub}>Create your family account and add your children</Text>
            </View>
            <Feather name="chevron-right" size={20} color={Colors.sand} />
          </Pressable>

          <Pressable
            style={styles.roleCard}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setStep("child-method");
            }}
          >
            <View style={[styles.roleIconWrap, { backgroundColor: `${Colors.accent}16` }]}>
              <Feather name="smile" size={28} color={Colors.accent} />
            </View>
            <View style={styles.roleCardBody}>
              <Text style={styles.roleCardTitle}>I'm a Kid</Text>
              <Text style={styles.roleCardSub}>Join your family or log in with your PIN</Text>
            </View>
            <Feather name="chevron-right" size={20} color={Colors.sand} />
          </Pressable>

          <Pressable
            onPress={() => setStep("parent-login")}
            style={styles.loginLink}
          >
            <Text style={styles.loginLinkText}>Already have an account? <Text style={styles.loginLinkAccent}>Sign in</Text></Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (step === "parent-signup") {
    return (
      <View style={[styles.container, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.formHeader}>
          <Pressable onPress={() => setStep("role")} style={styles.backBtn}>
            <Feather name="arrow-left" size={22} color={Colors.text} />
          </Pressable>
          <Text style={styles.formTitle}>Create Account</Text>
          <Text style={styles.formSubtitle}>Set up your parent dashboard</Text>
        </View>
        <View style={styles.formBody}>
          <TetherInput
            label="Your Name"
            placeholder="e.g. Sarah"
            value={parentName}
            onChangeText={setParentName}
            icon="user"
            autoCapitalize="words"
          />
          <TetherInput
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            icon="mail"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TetherInput
            label="Password"
            placeholder="Create a secure password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            icon="lock"
            autoCapitalize="none"
          />
          <View style={{ marginTop: 8 }}>
            <TetherButton title="Create Account" onPress={handleSignup} loading={loading} />
          </View>
        </View>
      </View>
    );
  }

  if (step === "parent-login") {
    return (
      <View style={[styles.container, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.formHeader}>
          <Pressable onPress={() => setStep("role")} style={styles.backBtn}>
            <Feather name="arrow-left" size={22} color={Colors.text} />
          </Pressable>
          <Text style={styles.formTitle}>Welcome Back</Text>
          <Text style={styles.formSubtitle}>Sign in to your account</Text>
        </View>
        <View style={styles.formBody}>
          <TetherInput
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            icon="mail"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TetherInput
            label="Password"
            placeholder="Your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            icon="lock"
            autoCapitalize="none"
          />
          <View style={{ marginTop: 8 }}>
            <TetherButton title="Sign In" onPress={handleLogin} loading={loading} />
          </View>
        </View>
      </View>
    );
  }

  if (step === "child-method") {
    return (
      <View style={[styles.container, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.roleContent}>
          <Pressable onPress={() => setStep("role")} style={styles.backBtn}>
            <Feather name="arrow-left" size={22} color={Colors.text} />
          </Pressable>
          <Text style={styles.roleTitle}>How do you want to connect?</Text>
          <Text style={styles.roleSubtitle}>Ask your parent which option to use</Text>

          <Pressable
            style={styles.roleCard}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setStep("child-join");
            }}
          >
            <View style={[styles.roleIconWrap, { backgroundColor: `${Colors.primary}16` }]}>
              <Feather name="link" size={28} color={Colors.primary} />
            </View>
            <View style={styles.roleCardBody}>
              <Text style={styles.roleCardTitle}>Join with Family Code</Text>
              <Text style={styles.roleCardSub}>Your parent has a code like TETHER-ABC123</Text>
            </View>
            <Feather name="chevron-right" size={20} color={Colors.sand} />
          </Pressable>

          <Pressable
            style={styles.roleCard}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setStep("child-login-code");
            }}
          >
            <View style={[styles.roleIconWrap, { backgroundColor: `${Colors.accent}16` }]}>
              <Feather name="log-in" size={28} color={Colors.accent} />
            </View>
            <View style={styles.roleCardBody}>
              <Text style={styles.roleCardTitle}>Log In with Family Code</Text>
              <Text style={styles.roleCardSub}>Already have an account? Sign in with your code and PIN</Text>
            </View>
            <Feather name="chevron-right" size={20} color={Colors.sand} />
          </Pressable>

          <Pressable
            onPress={() => setStep("child-login-email")}
            style={styles.loginLink}
          >
            <Text style={styles.loginLinkText}>Use <Text style={styles.loginLinkAccent}>parent's email</Text> instead</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (step === "child-join") {
    return (
      <View style={[styles.container, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.formHeader}>
          <Pressable onPress={() => setStep("child-method")} style={styles.backBtn}>
            <Feather name="arrow-left" size={22} color={Colors.text} />
          </Pressable>
          <Text style={styles.formTitle}>Join Your Family</Text>
          <Text style={styles.formSubtitle}>Ask your parent for the family code</Text>
        </View>
        <View style={styles.formBody}>
          <TetherInput
            label="Family Code"
            placeholder="TETHER-ABC123"
            value={familyCode}
            onChangeText={(t) => setFamilyCode(t.toUpperCase())}
            icon="link"
            autoCapitalize="characters"
          />
          <TetherInput
            label="Your Name"
            placeholder="e.g. Olivia"
            value={childName}
            onChangeText={setChildName}
            icon="smile"
            autoCapitalize="words"
          />
          <TetherInput
            label="Your Age"
            placeholder="e.g. 10"
            value={childAge}
            onChangeText={setChildAge}
            icon="calendar"
            keyboardType="numeric"
          />
          <TetherInput
            label="Create a PIN"
            placeholder="Choose a 4-digit PIN"
            value={childPin}
            onChangeText={(t) => setChildPin(t.replace(/[^0-9]/g, "").slice(0, 6))}
            secureTextEntry
            keyboardType="numeric"
            icon="lock"
          />
          <View style={{ marginTop: 8 }}>
            <TetherButton title="Join Family" onPress={handleJoinFamily} loading={loading} />
          </View>
        </View>
      </View>
    );
  }

  if (step === "child-login-code") {
    return (
      <View style={[styles.container, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.formHeader}>
          <Pressable onPress={() => setStep("child-method")} style={styles.backBtn}>
            <Feather name="arrow-left" size={22} color={Colors.text} />
          </Pressable>
          <Text style={styles.formTitle}>Kid Login</Text>
          <Text style={styles.formSubtitle}>Use your family code and PIN</Text>
        </View>
        <View style={styles.formBody}>
          <TetherInput
            label="Family Code"
            placeholder="TETHER-ABC123"
            value={familyCode}
            onChangeText={(t) => setFamilyCode(t.toUpperCase())}
            icon="link"
            autoCapitalize="characters"
          />
          <TetherInput
            label="Your Name"
            placeholder="e.g. Olivia"
            value={childName}
            onChangeText={setChildName}
            icon="smile"
            autoCapitalize="words"
          />
          <TetherInput
            label="PIN"
            placeholder="Enter your 4-digit PIN"
            value={childPin}
            onChangeText={(t) => setChildPin(t.replace(/[^0-9]/g, "").slice(0, 6))}
            secureTextEntry
            keyboardType="numeric"
            icon="lock"
          />
          <View style={{ marginTop: 8 }}>
            <TetherButton title="Enter Tether" onPress={handleChildLoginWithCode} loading={loading} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}>
      <View style={styles.formHeader}>
        <Pressable onPress={() => setStep("child-method")} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={Colors.text} />
        </Pressable>
        <Text style={styles.formTitle}>Kid Login</Text>
        <Text style={styles.formSubtitle}>Use your parent's email and PIN</Text>
      </View>
      <View style={styles.formBody}>
        <TetherInput
          label="Parent's Email"
          placeholder="parent@example.com"
          value={childParentEmail}
          onChangeText={setChildParentEmail}
          icon="mail"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TetherInput
          label="Your Name"
          placeholder="e.g. Olivia"
          value={childName}
          onChangeText={setChildName}
          icon="smile"
          autoCapitalize="words"
        />
        <TetherInput
          label="PIN"
          placeholder="Enter your 4-digit PIN"
          value={childPin}
          onChangeText={(t) => setChildPin(t.replace(/[^0-9]/g, "").slice(0, 6))}
          secureTextEntry
          keyboardType="numeric"
          icon="lock"
        />
        <View style={{ marginTop: 8 }}>
          <TetherButton title="Enter Tether" onPress={handleChildLoginWithEmail} loading={loading} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  slide: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    gap: 20,
  },
  slideIconWrap: {
    width: 100,
    height: 100,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  slideTitle: {
    fontFamily: Fonts.heading,
    fontSize: 28,
    color: Colors.text,
    textAlign: "center",
    lineHeight: 36,
  },
  slideSubtitle: {
    fontFamily: Fonts.body,
    fontSize: 15,
    color: Colors.textMid,
    textAlign: "center",
    lineHeight: 22,
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
  },
  dotActive: {
    backgroundColor: Colors.primary,
    width: 24,
  },
  slideActions: {
    paddingHorizontal: 24,
  },
  roleContent: {
    flex: 1,
    paddingHorizontal: 24,
    gap: 16,
  },
  roleTitle: {
    fontFamily: Fonts.heading,
    fontSize: 28,
    color: Colors.text,
    marginBottom: 0,
  },
  roleSubtitle: {
    fontFamily: Fonts.body,
    fontSize: 15,
    color: Colors.textMid,
    marginBottom: 8,
  },
  roleCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 18,
    padding: 18,
    gap: 14,
  },
  roleIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  roleCardBody: {
    flex: 1,
    gap: 3,
  },
  roleCardTitle: {
    fontFamily: Fonts.bodyBold,
    fontSize: 16,
    color: Colors.text,
  },
  roleCardSub: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.textMid,
    lineHeight: 18,
  },
  loginLink: {
    alignItems: "center",
    marginTop: 12,
  },
  loginLinkText: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.textMid,
  },
  loginLinkAccent: {
    fontFamily: Fonts.bodyBold,
    color: Colors.accent,
  },
  formHeader: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    marginLeft: -8,
  },
  formTitle: {
    fontFamily: Fonts.heading,
    fontSize: 28,
    color: Colors.text,
    marginBottom: 4,
  },
  formSubtitle: {
    fontFamily: Fonts.body,
    fontSize: 15,
    color: Colors.textMid,
  },
  formBody: {
    paddingHorizontal: 24,
  },
});
