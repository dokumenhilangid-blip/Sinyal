# SINYAL — Documentation

> An AI-native behavioral mirror that reconstructs emotional patterns from digital artifacts.

This directory holds the source-of-truth design documents for SINYAL. Both documents are **pre-implementation** — they define what SINYAL is and how it should be built, before any code is written.

## Documents

| Document | Purpose | Audience |
|---|---|---|
| [PRD.md](./PRD.md) | Product Requirements — vision, emotional thesis, UX strategy, demo psychology, anti-goals, success metrics | Founders, designers, hackathon judges |
| [VDS.md](./VDS.md) | Visual Direction System — visual philosophy, typography, motion, color, card system, anti-patterns, agent execution rules | Designers, frontend engineers, AI coding agents |
| [SDD.md](./SDD.md) | System Design — frontend, backend, AI inference pipeline, Gemini orchestration, Cloud Run deployment, demo stability | Engineers, technical reviewers |

## Reading Order

1. **PRD first** — to internalize the emotional contract and the product's reason to exist.
2. **VDS second** — to understand how the chamber is composed, the type breathes, and the anti-patterns are guarded.
3. **SDD third** — to understand how the contract and the chamber are enforced through architecture.

The VDS assumes the PRD's vocabulary (the entity, the reveal, the Wow Moment, the voice contract). The SDD assumes both. Reading them out of order will lose context.

## Stack at a Glance

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind v4, Motion
- **Backend:** Node.js 20 on Google Cloud Run (Hono)
- **AI:** Gemini 2.5 Flash (primary) + Gemini 2.5 Pro (fallback for complex sessions)
- **Storage:** Google Cloud Storage (uploads only, 1-hour TTL)
- **No database in MVP.** No auth in MVP. No analytics in MVP.

## Status

- [x] PRD locked
- [x] VDS locked
- [x] SDD locked
- [ ] Voice contract + exemplars (next phase, in Google AI Studio)
- [ ] Client cinema scaffold
- [ ] Inference service
- [ ] Demo hardening

## Non-Negotiables

These come from the PRD and apply to every implementation decision:

- One sentence per reveal card.
- No emoji, no advice, no motivational tone, ever.
- Mobile-first; desktop is a degraded mode.
- The demo must work even with no network — fallback path is a first-class feature.
- The product is observational, not therapeutic.

## Out of Scope (MVP)

Accounts, history, multi-language output, audio/video uploads, notifications, social features, native apps, monetization. See PRD §29 for the full list.
