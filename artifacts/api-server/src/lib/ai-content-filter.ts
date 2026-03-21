import { anthropic } from "@workspace/integrations-anthropic-ai";

type AlertLevel = "none" | "level1" | "level2" | "level3" | "level4" | "level5";

interface AIScanResult {
  alertLevel: AlertLevel;
  reason: string | null;
  title: string;
}

const SYSTEM_PROMPT = `You are a content safety filter for a children's messaging app called Tether. Your job is to analyze messages sent between kids (ages 6-17) and determine if they contain inappropriate content.

Classify messages into one of these levels:
- "none": Clean, safe message. Normal kid conversation.
- "level1": Slightly dismissive or sarcastic tone, but not harmful. Examples: passive-aggressive comments, eye-roll energy.
- "level2": Mild potty humor or crude language that isn't targeting anyone. Bathroom jokes, mild exclamations.
- "level3": Unkind, mean, or hurtful language directed at someone. Insults, name-calling, exclusion, mocking, subtle bullying.
- "level4": References to violence, self-harm, weapons, drugs, alcohol, or other dangerous topics. Also includes manipulation, coercion, or peer pressure about dangerous activities.
- "level5": Explicit sexual content, predatory behavior, grooming patterns (asking for personal info, asking to meet secretly, asking to keep secrets from parents, asking for photos), sharing of dangerous links, or any content that poses immediate danger to a child.

Important guidelines:
- Consider context and intent, not just keywords. "My grandma died last year" is NOT level4.
- Slang and abbreviations kids use should be decoded and evaluated.
- Subtle bullying and social manipulation should be caught even without explicit keywords.
- Grooming patterns are ALWAYS level5 even if individual messages seem innocent.
- Be protective but not overly restrictive — normal kid conversation should be "none".

Respond ONLY with valid JSON: {"level": "none|level1|level2|level3|level4|level5", "reason": "brief explanation or null"}`;

const FAITH_MODE_ADDITION = `

Additionally, this child has "Faith Mode" enabled (Christian values). Also flag:
- "level1" if the message contains disrespectful language about faith, God, or religious figures.
- "level2" if the message mocks or belittles someone's faith or religious beliefs.
- "level3" if the message pressures someone to abandon their faith or contains anti-religious hostility.
Note: Normal discussion about faith, questions, or curiosity is fine and should be "none".`;

export async function aiScanContent(
  content: string,
  faithModeEnabled: boolean = false,
): Promise<AIScanResult> {
  try {
    const systemPrompt = faithModeEnabled
      ? SYSTEM_PROMPT + FAITH_MODE_ADDITION
      : SYSTEM_PROMPT;

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 256,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `Analyze this message from a child: "${content}"`,
        },
      ],
    });

    let text =
      response.content[0].type === "text" ? response.content[0].text : "";

    text = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

    const parsed = JSON.parse(text);
    const level = parsed.level as AlertLevel;
    const reason = parsed.reason || null;

    const titles: Record<AlertLevel, string> = {
      none: "Clean",
      level1: "Soft Flag — Tone",
      level2: "Mild Language Noted",
      level3: "Unkind Language Detected",
      level4: "High Priority — Review Required",
      level5: "Critical — Message Blocked",
    };

    return {
      alertLevel: level,
      reason,
      title: titles[level] || "Unknown",
    };
  } catch (error) {
    console.error("AI content filter error:", error);
    return {
      alertLevel: "none",
      reason: null,
      title: "Clean",
    };
  }
}
