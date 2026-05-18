// VDS §6 — Motion and Transition Language
// Two easings only. No springs. No bounces.

export const EASING_QUIET: [number, number, number, number] = [0.22, 0.61, 0.36, 1];
export const EASING_SETTLE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const DUR_FAST = 0.2; // 200ms — micro-state changes
export const DUR_BASE = 0.4; // 400ms — exit transitions
export const DUR_SLOW = 0.6; // 600ms — standard enter, card-to-card
export const DUR_BREATH = 1.2; // 1200ms — entry headline rise
export const DUR_DWELL = 1.5; // 1500ms — mandatory hold before advance

// VDS §17 — Psychological Timing
export const LOADER_MIN_MS = 12000; // 12s minimum loader hold
export const BLACK_GAP_MS = 200; // gap between cards
export const FINAL_AFFORDANCE_DELAY_MS = 2000; // delay before final card shows exit
export const LOADER_PHRASE_INTERVAL_MS = 2500;
