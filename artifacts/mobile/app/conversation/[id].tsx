import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { Fonts } from "@/constants/typography";
import { useAuth } from "@/context/AuthContext";
import { Avatar } from "@/components/ui/Avatar";
import { useDemoData } from "@/hooks/useDemoData";
import { EmojiPicker } from "@/components/EmojiPicker";

export default function ConversationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const convoId = parseInt(id ?? "0");
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { conversations, getMessages } = useDemoData();
  const isChild = user?.role === "child";

  const convo = conversations.find((c) => c.id === convoId);
  const messages = getMessages(convoId);

  const [inputText, setInputText] = useState("");
  const [localMessages, setLocalMessages] = useState(messages);
  const [showEmoji, setShowEmoji] = useState(false);

  const handleSend = useCallback(() => {
    if (!inputText.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newMsg = {
      id: Date.now(),
      senderId: user?.id ?? 0,
      senderName: user?.displayName ?? "Me",
      content: inputText.trim(),
      alertLevel: "none",
      isBlocked: false,
      createdAt: "Just now",
      isMine: true,
    };
    setLocalMessages((prev) => [...prev, newMsg]);
    setInputText("");
    setShowEmoji(false);
  }, [inputText, user]);

  const handleEmojiSelect = (emoji: string) => {
    setInputText((prev) => prev + emoji);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={Colors.text} />
        </Pressable>
        <Avatar name={convo?.contactName ?? "?"} color={convo?.contactAvatarColor ?? Colors.accent} size={36} />
        <View style={styles.headerBody}>
          <Text style={styles.headerName}>{convo?.contactName ?? "Chat"}</Text>
          <Text style={styles.headerStatus}>Online</Text>
        </View>
        {!isChild && (
          <Pressable style={styles.headerBtn}>
            <Feather name="shield" size={18} color={Colors.primary} />
          </Pressable>
        )}
      </View>

      <KeyboardAvoidingView
        behavior="padding"
        style={styles.flex}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <FlatList
          data={localMessages}
          keyExtractor={(item) => item.id.toString()}
          inverted={false}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View
              style={[
                styles.msgRow,
                item.isMine ? styles.msgRowMine : styles.msgRowTheirs,
              ]}
            >
              {!item.isMine && (
                <Avatar name={item.senderName} color={convo?.contactAvatarColor ?? Colors.accent} size={28} />
              )}
              <View
                style={[
                  styles.bubble,
                  item.isMine ? styles.bubbleMine : styles.bubbleTheirs,
                  item.isBlocked && styles.bubbleBlocked,
                ]}
              >
                <Text
                  style={[
                    styles.bubbleText,
                    item.isMine ? styles.bubbleTextMine : styles.bubbleTextTheirs,
                  ]}
                >
                  {item.isBlocked ? "[Message blocked by content filter]" : item.content}
                </Text>
                <Text style={[styles.bubbleTime, item.isMine && styles.bubbleTimeMine]}>
                  {item.createdAt}
                </Text>
              </View>
            </View>
          )}
        />

        {isChild && showEmoji && (
          <EmojiPicker onSelect={handleEmojiSelect} onClose={() => setShowEmoji(false)} />
        )}

        <View style={[styles.inputBar, { paddingBottom: insets.bottom + 8 }]}>
          {isChild && (
            <Pressable
              style={styles.emojiBtn}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowEmoji(!showEmoji);
              }}
            >
              <Feather name="smile" size={22} color={showEmoji ? Colors.accent : Colors.textMid} />
            </Pressable>
          )}
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              placeholderTextColor={Colors.sand}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
          </View>
          <Pressable
            style={[styles.sendBtn, !!inputText.trim() && styles.sendBtnActive]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Feather name="send" size={18} color={inputText.trim() ? Colors.white : Colors.sand} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerBody: { flex: 1 },
  headerName: { fontFamily: Fonts.bodyBold, fontSize: 16, color: Colors.text },
  headerStatus: { fontFamily: Fonts.body, fontSize: 12, color: Colors.primary },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: `${Colors.primary}12`,
    alignItems: "center",
    justifyContent: "center",
  },
  messageList: {
    padding: 16,
    gap: 6,
  },
  msgRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    marginBottom: 6,
  },
  msgRowMine: { justifyContent: "flex-end" },
  msgRowTheirs: { justifyContent: "flex-start" },
  bubble: {
    maxWidth: "75%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  bubbleMine: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleTheirs: {
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bubbleBlocked: {
    backgroundColor: `${Colors.alert4}12`,
    borderColor: `${Colors.alert4}30`,
  },
  bubbleText: {
    fontFamily: Fonts.body,
    fontSize: 15,
    lineHeight: 21,
  },
  bubbleTextMine: { color: Colors.white },
  bubbleTextTheirs: { color: Colors.text },
  bubbleTime: {
    fontFamily: Fonts.body,
    fontSize: 10,
    color: Colors.textMid,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  bubbleTimeMine: { color: "rgba(255,255,255,0.7)" },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingTop: 10,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 8,
  },
  emojiBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  inputWrap: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
  },
  input: {
    fontFamily: Fonts.body,
    fontSize: 15,
    color: Colors.text,
    maxHeight: 80,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnActive: {
    backgroundColor: Colors.primary,
  },
});
