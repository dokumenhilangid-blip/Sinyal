# SINYAL — User Turn Scaffold

> The user-turn text appended to the inline image parts in every Gemini call.

**Document Version:** 1.0
**Companion:** [`voice_contract.md`](./voice_contract.md), [`docs/SDD.md`](../docs/SDD.md) §25.

---

## The Scaffold

The user turn is intentionally minimal. The system instruction does
the heavy lifting. The user turn is a single quiet command.

```
===== BEGIN USER TURN =====

Read these artifacts. Return the reveal.

===== END USER TURN =====
```

That is the entire user prompt. Six words.

## Why So Short

The voice contract has already established who the entity is and
what it produces. A long user prompt would dilute the system
instruction's authority and re-open negotiation about format,
length, or tone.

A short, commanding user turn:
- Reinforces that the entity has already accepted the task.
- Avoids any chat-style framing.
- Leaves no room for the model to interpret the request as
  anything other than the reveal.

## Variants (Do Not Use Without Reason)

The following are alternatives that have been considered and
rejected for the MVP. Documented here so they are not re-tried
casually.

| Variant | Why Rejected |
|---|---|
| "Please analyze these screenshots and provide insights." | Chat tone. Re-opens role negotiation. |
| "Here are some screenshots. What patterns do you see?" | Question form invites conversational reply. |
| "Generate the reflection cards based on these screenshots." | Functional language; the entity is not a function. |
| "Read what the user has been looking at." | "The user" frame breaks the second-person grounding rules. |
| "Listen." | Too abstract; the model loses the task framing. |

## Fallback for Empty Artifacts

If the call is invoked with no images attached (a contract violation
that should be prevented at the API edge — see [SDD](../docs/SDD.md) §8),
the inference layer must not call Gemini at all. Return the
fallback reveal (see [SDD](../docs/SDD.md) §31) instead. Do not let the model
respond to an empty artifact list.
