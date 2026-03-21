import React, { useState } from "react";
import { View, TextInput, Text, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import Colors from "@/constants/colors";
import { Fonts } from "@/constants/typography";

interface TetherInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric";
  autoCapitalize?: "none" | "sentences" | "words";
  error?: string;
  icon?: keyof typeof Feather.glyphMap;
  multiline?: boolean;
}

export function TetherInput({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "sentences",
  error,
  icon,
  multiline = false,
}: TetherInputProps) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      {!!label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputWrap,
          focused && styles.inputFocused,
          !!error && styles.inputError,
        ]}
      >
        {!!icon && <Feather name={icon} size={18} color={Colors.textMid} style={styles.icon} />}
        <TextInput
          style={[styles.input, multiline && styles.multiline]}
          placeholder={placeholder}
          placeholderTextColor={Colors.sand}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          multiline={multiline}
        />
        {secureTextEntry && (
          <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
            <Feather name={showPassword ? "eye-off" : "eye"} size={18} color={Colors.textMid} />
          </Pressable>
        )}
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 13,
    color: Colors.text,
    marginBottom: 6,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 13,
    paddingHorizontal: 14,
  },
  inputFocused: {
    borderColor: Colors.primary,
  },
  inputError: {
    borderColor: Colors.alert4,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontFamily: Fonts.body,
    fontSize: 15,
    color: Colors.text,
    paddingVertical: 14,
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  eyeBtn: {
    padding: 4,
  },
  error: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.alert4,
    marginTop: 4,
  },
});
