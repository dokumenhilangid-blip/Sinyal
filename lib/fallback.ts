// VDS §14 / SDD §31 — Fallback reveal
// Used when Gemini fails or validator rejects output.
// Cards are grounded in generic late-night digital patterns.

export const FALLBACK_REVEAL = {
  cards: [
    { kind: "opening" as const, text: "The hours after midnight kept their own quiet record." },
    { kind: "specific" as const, text: "You returned to the same three apps without opening anything new." },
    { kind: "specific" as const, text: "The same chorus replayed past one in the morning, four nights in a row." },
    { kind: "synthesis" as const, text: "What you saved did not match what you actually watched." },
    { kind: "specific" as const, text: "You left the longer messages unread and answered the short ones first." },
    { kind: "final" as const, text: "The night ended the way the previous nights had ended." },
  ],
};
