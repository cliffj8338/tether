import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { Fonts } from "@/constants/typography";

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

const categories = [
  {
    name: "Smileys",
    icon: "smile" as const,
    emojis: [
      "\u{1F60A}", "\u{1F604}", "\u{1F60D}", "\u{1F970}", "\u{1F917}",
      "\u{1F929}", "\u{1F60E}", "\u{1F607}", "\u{1F913}", "\u{1F643}",
      "\u{1F642}", "\u{1F609}", "\u{1F4AA}", "\u{1F44D}", "\u{1F44B}",
      "\u{1F64C}", "\u{1F44F}", "\u{270C}\u{FE0F}", "\u{1F91D}", "\u{1F64F}",
    ],
  },
  {
    name: "Hearts",
    icon: "heart" as const,
    emojis: [
      "\u{2764}\u{FE0F}", "\u{1F9E1}", "\u{1F49B}", "\u{1F49A}", "\u{1F499}",
      "\u{1F49C}", "\u{1F90E}", "\u{1F5A4}", "\u{1F90D}", "\u{1F49E}",
      "\u{1F495}", "\u{1F496}", "\u{1F493}", "\u{1F498}", "\u{1F49D}",
    ],
  },
  {
    name: "Nature",
    icon: "sun" as const,
    emojis: [
      "\u{2B50}", "\u{1F31F}", "\u{1F308}", "\u{2600}\u{FE0F}", "\u{1F33B}",
      "\u{1F33A}", "\u{1F339}", "\u{1F337}", "\u{1F33E}", "\u{1F332}",
      "\u{1F436}", "\u{1F431}", "\u{1F98B}", "\u{1F41D}", "\u{1F422}",
    ],
  },
  {
    name: "Activities",
    icon: "zap" as const,
    emojis: [
      "\u{26BD}", "\u{1F3C0}", "\u{1F3C8}", "\u{1F3BE}", "\u{1F3B5}",
      "\u{1F3B6}", "\u{1F3A8}", "\u{1F3AE}", "\u{1F4DA}", "\u{270F}\u{FE0F}",
      "\u{1F3C6}", "\u{1F3C5}", "\u{1F396}\u{FE0F}", "\u{1F947}", "\u{1F948}",
    ],
  },
  {
    name: "Food",
    icon: "coffee" as const,
    emojis: [
      "\u{1F34E}", "\u{1F34A}", "\u{1F347}", "\u{1F353}", "\u{1F34C}",
      "\u{1F370}", "\u{1F369}", "\u{1F366}", "\u{1F382}", "\u{1F36B}",
      "\u{1F354}", "\u{1F355}", "\u{1F32E}", "\u{1F35F}", "\u{1F37F}",
    ],
  },
];

export function EmojiPicker({ onSelect, onClose }: EmojiPickerProps) {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{categories[activeCategory].name}</Text>
        <Pressable onPress={onClose} style={styles.closeBtn}>
          <Feather name="x" size={18} color={Colors.textMid} />
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryBar}
        contentContainerStyle={styles.categoryBarContent}
      >
        {categories.map((cat, i) => (
          <Pressable
            key={cat.name}
            style={[styles.categoryBtn, activeCategory === i && styles.categoryBtnActive]}
            onPress={() => setActiveCategory(i)}
          >
            <Feather
              name={cat.icon}
              size={18}
              color={activeCategory === i ? Colors.accent : Colors.textMid}
            />
          </Pressable>
        ))}
      </ScrollView>

      <FlatList
        data={categories[activeCategory].emojis}
        numColumns={8}
        keyExtractor={(item, i) => `${item}-${i}`}
        contentContainerStyle={styles.emojiGrid}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            style={styles.emojiBtn}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onSelect(item);
            }}
          >
            <Text style={styles.emoji}>{item}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    height: 260,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
  },
  headerTitle: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 13,
    color: Colors.textMid,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryBar: {
    maxHeight: 44,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface,
  },
  categoryBarContent: {
    paddingHorizontal: 12,
    gap: 4,
    alignItems: "center",
  },
  categoryBtn: {
    width: 40,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryBtnActive: {
    backgroundColor: `${Colors.accent}14`,
  },
  emojiGrid: {
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  emojiBtn: {
    flex: 1,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    maxWidth: "12.5%",
  },
  emoji: {
    fontSize: 26,
  },
});
