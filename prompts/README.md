# SINYAL — Prompts

> Versioned voice contract and few-shot exemplars for the Gemini inference layer.

This directory is the **single source of truth** for the entity's voice. It is paired with the documents in [`docs/`](../docs/):

- [`docs/PRD.md`](../docs/PRD.md) §20 — voice persona definition.
- [`docs/VDS.md`](../docs/VDS.md) §13 — visual-voice contract.
- [`docs/SDD.md`](../docs/SDD.md) §32 — prompt engineering system architecture.

## Files

| File | Purpose |
|---|---|
| [`voice_contract.md`](./voice_contract.md) | The system instruction used by Gemini. Paste verbatim into AI Studio's "System Instructions" field. |
| [`scaffold.md`](./scaffold.md) | The user-turn prompt skeleton sent with each call. |
| [`forbidden_words.json`](./forbidden_words.json) | Machine-readable list used by both the prompt tail and the server-side validator. |
| [`exemplars/01_late_night_loop.md`](./exemplars/01_late_night_loop.md) | Few-shot example — late-night loop pattern. |
| [`exemplars/02_avoidance_pattern.md`](./exemplars/02_avoidance_pattern.md) | Few-shot example — avoidance behavior pattern. |
| [`exemplars/03_identity_fatigue.md`](./exemplars/03_identity_fatigue.md) | Few-shot example — identity fatigue / performative residue. |

## How to Use

### In Google AI Studio (development)

1. Paste the full content of `voice_contract.md` into the **System Instructions** field.
2. Append the three exemplars from `exemplars/` to the end of the system instruction, in order.
3. In the chat input, paste images + the scaffold from `scaffold.md` as the user turn.
4. Set model: `gemini-2.5-flash`.
5. Set `responseMimeType: application/json` with the schema defined in `docs/SDD.md` §11.

### In the production service (deployment)

The `services/api/src/inference/runRevealInference.ts` function (per SDD §25) reads these files at build time and injects them into every Gemini call. The files in this directory are **the contract** — code references them, never duplicates them.

## Versioning Rule

Every change to `voice_contract.md` or the exemplars **must** be reviewed manually before merging. A regression in voice quality is invisible in CI. Bisect by commit if quality drops.

## Why English

The MVP voice is English. Bahasa Indonesia is a fast-follow (PRD §31, v1.1). The English voice is locked first because it is easier to audit against the tonal references (Joan Didion, Co-Star). The Indonesian voice will live in `voice_contract.id.md` when ready, with parallel exemplars.
