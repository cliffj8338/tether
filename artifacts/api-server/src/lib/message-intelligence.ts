import { anthropic } from "@workspace/integrations-anthropic-ai";
import { db, messageAnalyticsTable, messagesTable } from "@workspace/db";
import { eq, desc, and } from "drizzle-orm";

interface MessageIntelligence {
  wordCount: number;
  sentenceCount: number;
  avgWordLength: number;
  vocabularyComplexity: number;
  sentimentScore: number;
  sentimentLabel: "very_negative" | "negative" | "neutral" | "positive" | "very_positive";
  emotionalTone: "joy" | "sadness" | "anger" | "fear" | "surprise" | "disgust" | "trust" | "anticipation" | "curiosity" | "empathy" | "anxiety" | "pride" | "shame" | "gratitude" | "loneliness" | "neutral";
  topicCategory: "social" | "emotional" | "academic" | "faith" | "conflict" | "humor" | "family" | "friendship" | "identity" | "health" | "media" | "creative" | "sports" | "technology" | "other";
  topicKeywords: string[];
  hasEmoji: boolean;
  hasSlang: boolean;
}

const INTELLIGENCE_PROMPT = `You are a research analyst studying children's digital communication patterns. Analyze the following message from a child (ages 6-17) and extract structured metadata for research purposes. All data is anonymized and aggregated.

Respond ONLY with valid JSON matching this exact schema:
{
  "sentimentScore": <number from -1.0 to 1.0>,
  "sentimentLabel": "<very_negative|negative|neutral|positive|very_positive>",
  "emotionalTone": "<joy|sadness|anger|fear|surprise|disgust|trust|anticipation|curiosity|empathy|anxiety|pride|shame|gratitude|loneliness|neutral>",
  "topicCategory": "<social|emotional|academic|faith|conflict|humor|family|friendship|identity|health|media|creative|sports|technology|other>",
  "topicKeywords": ["<keyword1>", "<keyword2>", "<keyword3>"],
  "vocabularyComplexity": <number 0.0-1.0 where 0=very simple, 1=advanced>,
  "hasSlang": <boolean>
}

Guidelines:
- sentimentScore: -1.0 = extremely negative, 0 = neutral, 1.0 = extremely positive
- vocabularyComplexity: Consider word sophistication relative to age group. Simple greetings = 0.1, age-appropriate = 0.4-0.6, advanced vocabulary = 0.8+
- topicKeywords: 1-3 anonymized topic words capturing the subject matter (not the actual words used, but the themes)
- hasSlang: true if message uses slang, abbreviations, or informal language typical of youth digital communication
- emotionalTone: The primary emotional quality of the message`;

function computeBasicMetrics(content: string) {
  const words = content.trim().split(/\s+/).filter(w => w.length > 0);
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

  return {
    wordCount: words.length,
    sentenceCount: Math.max(sentences.length, 1),
    avgWordLength: words.length > 0
      ? words.reduce((sum, w) => sum + w.replace(/[^a-zA-Z]/g, "").length, 0) / words.length
      : 0,
    hasEmoji: emojiRegex.test(content),
  };
}

export async function analyzeMessage(
  content: string,
  messageId: number,
  conversationId: number,
  senderId: number,
  senderAge?: number | null,
): Promise<void> {
  try {
    const basicMetrics = computeBasicMetrics(content);

    if (basicMetrics.wordCount < 1) return;

    let aiAnalysis: Partial<MessageIntelligence> = {
      sentimentScore: 0,
      sentimentLabel: "neutral",
      emotionalTone: "neutral",
      topicCategory: "other",
      topicKeywords: [],
      vocabularyComplexity: 0.3,
      hasSlang: false,
    };

    if (basicMetrics.wordCount >= 2) {
      try {
        const response = await anthropic.messages.create({
          model: "claude-haiku-4-5",
          max_tokens: 256,
          system: INTELLIGENCE_PROMPT,
          messages: [{ role: "user", content: `Analyze: "${content}"` }],
        });

        let text = response.content[0].type === "text" ? response.content[0].text : "";
        text = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
        const parsed = JSON.parse(text);

        aiAnalysis = {
          sentimentScore: Math.max(-1, Math.min(1, parsed.sentimentScore ?? 0)),
          sentimentLabel: parsed.sentimentLabel ?? "neutral",
          emotionalTone: parsed.emotionalTone ?? "neutral",
          topicCategory: parsed.topicCategory ?? "other",
          topicKeywords: Array.isArray(parsed.topicKeywords) ? parsed.topicKeywords.slice(0, 5) : [],
          vocabularyComplexity: Math.max(0, Math.min(1, parsed.vocabularyComplexity ?? 0.3)),
          hasSlang: parsed.hasSlang ?? false,
        };
      } catch {
        // AI analysis failed — use defaults
      }
    }

    let ageGroup: string | undefined;
    if (senderAge) {
      if (senderAge <= 8) ageGroup = "6-8";
      else if (senderAge <= 11) ageGroup = "9-11";
      else if (senderAge <= 14) ageGroup = "12-14";
      else ageGroup = "15-17";
    }

    let responseTimeSeconds: number | undefined;
    let isConversationStarter = false;

    const previousMessages = await db
      .select()
      .from(messagesTable)
      .where(and(
        eq(messagesTable.conversationId, conversationId),
      ))
      .orderBy(desc(messagesTable.createdAt))
      .limit(2);

    if (previousMessages.length <= 1) {
      isConversationStarter = true;
    } else {
      const lastMsg = previousMessages.find(m => m.id !== messageId);
      if (lastMsg && lastMsg.senderId !== senderId) {
        responseTimeSeconds = Math.floor(
          (Date.now() - lastMsg.createdAt.getTime()) / 1000
        );
      }
    }

    await db.insert(messageAnalyticsTable).values({
      messageId,
      conversationId,
      senderId,
      senderAgeGroup: ageGroup,
      wordCount: basicMetrics.wordCount,
      sentenceCount: basicMetrics.sentenceCount,
      avgWordLength: basicMetrics.avgWordLength,
      vocabularyComplexity: aiAnalysis.vocabularyComplexity ?? 0.3,
      sentimentScore: aiAnalysis.sentimentScore ?? 0,
      sentimentLabel: aiAnalysis.sentimentLabel ?? "neutral",
      emotionalTone: aiAnalysis.emotionalTone ?? "neutral",
      topicCategory: aiAnalysis.topicCategory ?? "other",
      topicKeywords: aiAnalysis.topicKeywords ?? [],
      hasEmoji: basicMetrics.hasEmoji,
      hasSlang: aiAnalysis.hasSlang ?? false,
      responseTimeSeconds,
      isConversationStarter,
    });
  } catch (error) {
    console.error("Message intelligence analysis failed:", error);
  }
}
