import { CONTENT_DICTIONARY, type AlertLevel, type DictionaryEntry } from "./content-dictionary";

interface ScanResult {
  alertLevel: AlertLevel;
  reason: string | null;
  title: string;
  category?: string;
}

const TITLES: Record<AlertLevel, string> = {
  none: "Clean",
  level1: "Soft Flag — Tone",
  level2: "Mild Language Noted",
  level3: "Unkind Language Detected",
  level4: "High Priority — Review Required",
  level5: "Critical — Message Blocked",
};

const LEET_MAP: Record<string, string> = {
  "0": "o",
  "1": "i",
  "3": "e",
  "4": "a",
  "5": "s",
  "7": "t",
  "8": "b",
  "@": "a",
  "$": "s",
  "!": "i",
  "+": "t",
  "*": "",
  "#": "",
};

function normalizeLeetSpeak(text: string): string {
  let result = "";
  for (const ch of text) {
    result += LEET_MAP[ch] ?? ch;
  }
  return result;
}

function removeSpacingEvasion(text: string): string {
  return text.replace(/(\w)\s+(?=\w(?:\s+\w)*\b)/g, (match) => {
    const collapsed = match.replace(/\s+/g, "");
    if (collapsed.length <= 8) return collapsed;
    return match;
  });
}

function normalizeRepeats(text: string): string {
  return text.replace(/(.)\1{2,}/g, "$1$1");
}

function normalizeUnicode(text: string): string {
  return text
    .replace(/[\u0430]/g, "a") // Cyrillic а
    .replace(/[\u0435]/g, "e") // Cyrillic е
    .replace(/[\u043E]/g, "o") // Cyrillic о
    .replace(/[\u0440]/g, "p") // Cyrillic р
    .replace(/[\u0441]/g, "c") // Cyrillic с
    .replace(/[\u0445]/g, "x") // Cyrillic х
    .replace(/[\u0443]/g, "y") // Cyrillic у
    .replace(/[\u200B-\u200D\uFEFF]/g, ""); // zero-width chars
}

function prepareVariants(content: string): string[] {
  const original = content;
  const lower = content.toLowerCase();
  const noSpecial = lower.replace(/[.\-_~*#@!$%^&()]/g, "");
  const leetDecoded = normalizeLeetSpeak(lower);
  const noSpacing = removeSpacingEvasion(lower);
  const noRepeats = normalizeRepeats(lower);
  const unicodeNorm = normalizeUnicode(lower);
  const combined = normalizeRepeats(normalizeLeetSpeak(removeSpacingEvasion(normalizeUnicode(lower))));

  const variants = new Set([original, lower, noSpecial, leetDecoded, noSpacing, noRepeats, unicodeNorm, combined]);
  return Array.from(variants);
}

function matchDictionary(variants: string[], entries: DictionaryEntry[]): DictionaryEntry | null {
  for (const entry of entries) {
    for (const variant of variants) {
      if (entry.pattern.test(variant)) {
        return entry;
      }
    }
  }
  return null;
}

export function scanContent(content: string): ScanResult {
  const variants = prepareVariants(content);

  const levels: AlertLevel[] = ["level5", "level4", "level3", "level2", "level1"];

  for (const level of levels) {
    const entries = CONTENT_DICTIONARY.filter(e => e.alertLevel === level);
    const match = matchDictionary(variants, entries);
    if (match) {
      return {
        alertLevel: match.alertLevel,
        reason: match.reason,
        title: TITLES[match.alertLevel],
        category: match.category,
      };
    }
  }

  return {
    alertLevel: "none",
    reason: null,
    title: TITLES.none,
  };
}
