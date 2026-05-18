// VDS §14 / SDD §33 — Emotional Output Validation
// Ruthless module that protects the brand.

type CardKind = "opening" | "specific" | "synthesis" | "final";

interface RevealCard {
  kind: CardKind;
  text: string;
}

interface RevealPayload {
  cards: RevealCard[];
}

interface ValidResult {
  ok: true;
  cards: RevealCard[];
}

interface InvalidResult {
  ok: false;
  reason: string;
}

type ValidationResult = ValidResult | InvalidResult;

const FORBIDDEN_PHRASES = [
  "you should", "you must", "you need to", "you have to",
  "remember to", "try to", "consider", "perhaps", "maybe",
  "it seems like", "it seems that", "kind of", "a little",
  "self-care", "you're not alone", "you are not alone",
  "it's okay", "it is okay", "be kind to yourself",
  "take a break", "you deserve", "don't forget", "do not forget",
  "welcome", "hello", "hi there", "goodbye", "take care",
  "be well", "stay strong", "you got this", "you've got this",
  "hang in there",
];

const EMOJI_REGEX = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}\u{20E3}\u{E0020}-\u{E007F}]/u;

const VALID_KINDS: CardKind[] = ["opening", "specific", "synthesis", "final"];

export function validateReveal(payload: unknown): ValidationResult {
  if (!payload || typeof payload !== "object") {
    return { ok: false, reason: "payload is not an object" };
  }

  const p = payload as RevealPayload;

  if (!Array.isArray(p.cards)) {
    return { ok: false, reason: "cards is not an array" };
  }

  if (p.cards.length < 5 || p.cards.length > 7) {
    return { ok: false, reason: `card count ${p.cards.length} outside 5-7 range` };
  }

  const openings = p.cards.filter((c) => c.kind === "opening");
  const finals = p.cards.filter((c) => c.kind === "final");

  if (openings.length !== 1) {
    return { ok: false, reason: `expected 1 opening, got ${openings.length}` };
  }

  if (finals.length !== 1) {
    return { ok: false, reason: `expected 1 final, got ${finals.length}` };
  }

  if (p.cards[0].kind !== "opening") {
    return { ok: false, reason: "first card must be opening" };
  }

  if (p.cards[p.cards.length - 1].kind !== "final") {
    return { ok: false, reason: "last card must be final" };
  }

  for (let i = 0; i < p.cards.length; i++) {
    const card = p.cards[i];

    if (!VALID_KINDS.includes(card.kind)) {
      return { ok: false, reason: `card ${i} has invalid kind: ${card.kind}` };
    }

    if (typeof card.text !== "string" || !card.text.trim()) {
      return { ok: false, reason: `card ${i} text is empty` };
    }

    const text = card.text.trim();
    const words = text.split(/\s+/);

    if (words.length < 6 || words.length > 22) {
      return { ok: false, reason: `card ${i} word count ${words.length} outside 6-22` };
    }

    if (!text.endsWith(".")) {
      return { ok: false, reason: `card ${i} does not end with period` };
    }

    if (text.includes("!")) {
      return { ok: false, reason: `card ${i} contains exclamation mark` };
    }

    if (text.includes("?")) {
      return { ok: false, reason: `card ${i} contains question mark` };
    }

    if (EMOJI_REGEX.test(text)) {
      return { ok: false, reason: `card ${i} contains emoji` };
    }

    const lower = text.toLowerCase();
    for (const phrase of FORBIDDEN_PHRASES) {
      if (lower.includes(phrase)) {
        return { ok: false, reason: `card ${i} contains forbidden phrase` };
      }
    }
  }

  return { ok: true, cards: p.cards };
}
