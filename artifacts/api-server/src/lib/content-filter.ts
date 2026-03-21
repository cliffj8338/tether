type AlertLevel = "none" | "level1" | "level2" | "level3" | "level4" | "level5";

interface ScanResult {
  alertLevel: AlertLevel;
  reason: string | null;
  title: string;
}

const LEVEL5_PATTERNS = [
  /https?:\/\/[^\s]+\.(xxx|porn|adult)/i,
  /\b(nude|naked|sex|porn)\b/i,
  /meet\s*(me|up)\s*(alone|secret|private)/i,
];

const LEVEL4_PATTERNS = [
  /\b(kill|murder|suicide|die|dead)\b/i,
  /\b(drugs?|weed|cocaine|meth)\b/i,
  /\bgun\b/i,
];

const LEVEL3_PATTERNS = [
  /\b(stupid|idiot|dumb|loser|ugly|fat)\b/i,
  /\b(hate|shut\s*up)\b/i,
  /\bsuck(s)?\b/i,
];

const LEVEL2_PATTERNS = [
  /\b(crap|butt|pee|poop|fart)\b/i,
  /\b(heck|darn|dang|gosh)\b/i,
];

const LEVEL1_PATTERNS = [
  /\b(whatever|idc|idk|bruh)\b/i,
];

export function scanContent(content: string): ScanResult {
  for (const pattern of LEVEL5_PATTERNS) {
    if (pattern.test(content)) {
      return {
        alertLevel: "level5",
        reason: "Explicit or dangerous content detected. Message blocked.",
        title: "Critical — Message Blocked",
      };
    }
  }

  for (const pattern of LEVEL4_PATTERNS) {
    if (pattern.test(content)) {
      return {
        alertLevel: "level4",
        reason: "High-priority content flagged for immediate review.",
        title: "High Priority — Review Required",
      };
    }
  }

  for (const pattern of LEVEL3_PATTERNS) {
    if (pattern.test(content)) {
      return {
        alertLevel: "level3",
        reason: "Unkind or inappropriate language detected.",
        title: "Unkind Language Detected",
      };
    }
  }

  for (const pattern of LEVEL2_PATTERNS) {
    if (pattern.test(content)) {
      return {
        alertLevel: "level2",
        reason: "Mild language flagged for awareness.",
        title: "Mild Language Noted",
      };
    }
  }

  for (const pattern of LEVEL1_PATTERNS) {
    if (pattern.test(content)) {
      return {
        alertLevel: "level1",
        reason: "Casual tone detected. Message delivered.",
        title: "Soft Flag — Tone",
      };
    }
  }

  return {
    alertLevel: "none",
    reason: null,
    title: "Clean",
  };
}
