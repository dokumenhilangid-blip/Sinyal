# SINYAL — Product Requirements Document

> An AI-native behavioral mirror that reconstructs emotional patterns from digital artifacts.

**Document Version:** 1.0
**Status:** Source of Truth — Pre-Implementation
**Audience:** Founders, designers, engineers, hackathon judges
**Classification:** Cinematic AI Application

---

## 1. Executive Summary

SINYAL is a cinematic, AI-native experience that reads the residue of someone's digital life — screenshots of TikTok feeds, Spotify playlists, WhatsApp chats, Notes app fragments, screen-time captures — and reconstructs the emotional pattern hiding underneath.

It does not give advice. It does not motivate. It does not coach.

It observes.

The user uploads fragments. The system processes them through a multimodal reasoning pipeline (Gemini 2.5). The output is not a report. It is a sequence of cinematic emotional reveals — short, restrained, surgically accurate sentences that feel like a quiet entity has been watching, and finally chose to speak.

The product's success metric is not engagement, retention, or DAU. It is a single emotional reaction:

> "How does it know."

For the hackathon, SINYAL is engineered to produce that reaction within 90 seconds of demo time. The Google-native stack (Next.js 15, Cloud Run, Gemini 2.5 Flash + Pro, GCS) is chosen for inference quality, multimodal fidelity, and demo-grade latency — not for enterprise scale.

---

## 2. Product Vision

A future where AI is not a productivity tool, not a chatbot, not a co-pilot — but a quiet observer of the modern self.

SINYAL is the prototype of a new product category: **Behavioral Mirrors**. Tools that don't help you do more, but help you see what you've already been doing — without the framing your conscious mind would prefer.

The long-term vision is an entity that, given enough digital artifacts, can reconstruct the emotional shape of a week, a season, an era of someone's life — with the precision of a documentarian and the restraint of a therapist who refuses to give the answer.

The hackathon MVP is the first cinematic chamber of that entity.

---

## 3. Product Philosophy

Three philosophical commitments shape every decision:

**1. Observation over instruction.**
SINYAL never tells the user what to do. It tells the user what it sees. The user does the rest of the work themselves, in silence, after closing the app.

**2. Restraint over volume.**
Most AI apps over-deliver text. SINYAL under-delivers — on purpose. A single observation that lands is worth a thousand bullet points that don't.

**3. Cinematic time over interaction time.**
Time inside SINYAL moves slower than time inside a normal app. Pacing, pauses, fades, and reveals are non-negotiable design elements. The product is a film with one viewer.

---

## 4. Emotional Thesis

Modern digital life produces a measurable residue — what someone scrolls at 2am, what they save and never revisit, what they replay, what they avoid replying to.

This residue is more emotionally honest than what people say about themselves.

SINYAL's thesis: a sufficiently capable multimodal model, given a small set of these artifacts and the right interpretive scaffolding, can reconstruct an emotional pattern that the user themselves has been avoiding looking at.

The reveal is not new information. It is information the user already had but kept in peripheral vision. SINYAL pulls it to the center.

The emotional contract:
- The system will be specific.
- The system will not flatter.
- The system will not pathologize.
- The system will be true, and brief.

---

## 5. Core User Psychology

The target user is in one of three psychological states when they open SINYAL:

**State A — Curiosity with armor.**
"I want to see what AI can guess about me. I'm going to test it. I'm pretending to be detached."

**State B — Quiet exhaustion.**
"I've been feeling something I can't name. Maybe naming it would help. Maybe it wouldn't."

**State C — Performative play.**
"This will be a screenshot for my story. I want to see if it says something interesting enough to share."

SINYAL is designed so all three states converge on the same outcome by the end of the experience: a moment of recognition that breaks the framing they entered with. State A drops the armor. State B receives a name. State C gets a screenshot — but a different one than they expected.

The design's ethical anchor: never weaponize this recognition. Observe, don't accuse. Name, don't diagnose.

---

## 6. Problem Statement

Three intersecting problems define the product space:

**Problem 1 — Emotional illiteracy of digital life.**
People spend 4–8 hours/day producing digital artifacts that reflect their emotional state, but have no tool that reads those artifacts back to them.

**Problem 2 — AI's emotional blandness.**
General-purpose AI assistants are trained to be helpful, balanced, and inoffensive. This makes them incapable of emotionally precise observation. They round every sharp edge.

**Problem 3 — Mirror fatigue.**
Therapy is expensive and slow. Journaling apps are abandoned. Mood trackers are gamified. There is no low-friction, high-precision mirror for the version of self that lives inside a phone.

SINYAL targets the gap between the artifacts (abundant), the model capability (now sufficient), and the emotional contract (almost never delivered).

---

## 7. Why Existing AI Products Fail Emotionally

A diagnostic of the failure modes SINYAL is designed against:

| Failure Mode | Where It Appears | Why It Fails |
|---|---|---|
| **Helpfulness reflex** | ChatGPT, Claude, Gemini chat | Always wants to assist; cannot just observe |
| **Sycophancy bias** | Most consumer LLM apps | Validates the user; refuses to be uncomfortable |
| **Listicle output** | AI summarizers, journaling apps | Bullets kill emotional weight |
| **Therapeutic LARP** | "AI therapist" apps | Imitates therapy; safer than real therapy; less honest than a friend |
| **Productivity colonization** | Notion AI, Reflect, etc. | Reframes inner life as tasks |
| **Dashboard logic** | Mood trackers, screen time apps | Quantifies what shouldn't be quantified |
| **Generic SaaS UI** | Almost everything | Optimized for retention, not for landing one true sentence |

SINYAL refuses each of these defaults. The refusal is the product.

---

## 8. Market Positioning

**Category:** Behavioral Mirror (new category — SINYAL defines it).

**Adjacent categories (not competitors, reference points):**
- Cinematic AI experiences (e.g., generative film tools)
- Self-reflection apps (journaling, mood tracking)
- Documentary photography
- Long-form personal essays

**Positioning statement:**
SINYAL is to journaling apps what a documentary is to a diary. It does not ask the user to write. It reads what they have already written, in fragments, across platforms, and reflects it back without the user's framing.

**Target audience for hackathon demo:**
- Hackathon judges (technical sophistication + emotional impact)
- Urban Gen Z (primary future users)
- AI/design-literate early adopters who are tired of generic AI UX

---

## 9. Competitive Landscape

There is no direct competitor. The closest reference points, and how SINYAL differentiates:

| Reference | What They Do | What SINYAL Does Differently |
|---|---|---|
| Spotify Wrapped | Annual data ritual, celebratory tone | Year-round, restrained tone, reads any artifact |
| Apple Screen Time | Quantified attention dashboard | Qualitative emotional inference, not numbers |
| Replika / Character.ai | Synthetic relationship | No relationship — only observation |
| Woebot / Wysa | CBT chatbot | Not therapeutic; not interactive; one-way mirror |
| BeReal | Forced authenticity ritual | No new content needed; uses existing residue |
| Day One / Reflectly | Journaling | User writes nothing; system reads everything |
| Co-Star | Astrology with attitude | Real signal, not narrative scaffolding |

The most useful reference is Co-Star, not for content but for tone: confident, cold, slightly invasive, never apologetic. SINYAL adopts that tonal stance with real psychological signal underneath.

---

## 10. Anti-Goals

Things SINYAL will deliberately not do, even if asked:

- Will not give advice.
- Will not generate to-do lists.
- Will not motivate.
- Will not include emoji in output.
- Will not include hedging language ("it seems like maybe perhaps").
- Will not produce paragraphs longer than four sentences.
- Will not include disclaimers in the reveal flow.
- Will not gamify (no streaks, no points, no levels).
- Will not push notifications.
- Will not store user uploads beyond the session unless explicitly opted in.
- Will not require an account for the core experience.
- Will not feel like a chat.
- Will not feel like a dashboard.
- Will not feel like a SaaS product.

Every anti-goal is a design constraint that produces emotional precision.

---

## 11. Emotional Design Principles

Eight principles, ranked by priority:

1. **Specificity beats sympathy.** A precise observation lands harder than a kind one.
2. **Silence is content.** Pauses, fades, and empty space carry emotional weight.
3. **The system is not a friend.** It is a quiet observer. Maintain that distance.
4. **The reveal is the product.** Everything before it is build-up; everything after is decay.
5. **Restraint signals intelligence.** Less text, more weight.
6. **Beauty must be earned.** No decoration that doesn't carry meaning.
7. **The user must feel seen, not analyzed.** The difference is everything.
8. **One sentence per card.** Emotional weight collapses past the second sentence.

---

## 12. Product Pillars

Four pillars define what SINYAL is and isn't:

**Pillar 1 — The Mirror.**
A multimodal inference system that reads digital artifacts and reconstructs emotional patterns.

**Pillar 2 — The Reveal.**
A cinematic UI flow that delivers observations with the pacing of a film, not a chat.

**Pillar 3 — The Voice.**
A tightly defined AI persona — observational, restrained, intimate, never therapeutic — held consistent through prompt architecture.

**Pillar 4 — The Frame.**
A visual design system (typography, motion, color, sound design) that signals "this is not an app" within three seconds of opening.

If any pillar is weak, the product collapses. All four must be present in the MVP.

---

## 13. User Personas

### Persona 1 — Aria, 23, Jakarta

Works in a creative agency. Spends 6 hours/day on TikTok, Spotify, WhatsApp. Knows she scrolls too much. Doesn't want to be told to scroll less. Opens SINYAL out of curiosity, half-ironically. Expected reaction at reveal: stops scrolling for ten seconds. Screenshots one card. Doesn't post it.

### Persona 2 — Reza, 27, Bandung

Junior product designer. AI-literate. Has tried ChatGPT, Claude, Notion AI. Bored of them. Opens SINYAL because it looks different. Expected reaction at reveal: sends the link to one specific friend with no caption.

### Persona 3 — Hackathon Judge, 30–45

Has seen 40 demos this weekend. Most look the same. Opens SINYAL on a phone during the demo. Expected reaction within 60 seconds: leans in. Within 90 seconds: writes a note.

The MVP is engineered for Persona 3 first. If it works for the judge in 90 seconds, it works for everyone.

---

## 14. Primary User Journey

The journey is structured as a five-act film, not a funnel:

**Act 1 — Approach (0–10s).**
User lands on a near-empty page. A single line of text fades in. No logo cluster, no nav, no marketing copy. The page feels like a closed room.

**Act 2 — Surrender (10–40s).**
User taps to begin. A short, quiet prompt: "Upload what you've been looking at." Upload zone is minimal — drag, tap, paste. The system accepts 1–10 images. No required fields. No account.

**Act 3 — Processing (40–70s).**
Cinematic loading state. Not a spinner. Phrases drift across the screen — diegetic, ambient, written in the voice of the entity. ("Reading what you didn't say." "Looking for the pattern.") Approximate duration: 15–25s. Pacing matters more than speed.

**Act 4 — Reveal (70–150s).**
The reveal sequence. 5–7 cards, each one sentence, delivered with full-screen typography, restrained motion, and pause time between cards. User taps to advance. Cannot skip.

**Act 5 — Aftermath (150s+).**
A final card. Then a quiet exit option: save the reveal, share a single card as an image, or close. No retention loop. No "try again with more photos!" The product ends with intention.

---

## 15. Emotional Journey Mapping

| Act | User Emotional State | Designed System Response |
|---|---|---|
| Approach | Curiosity, mild skepticism | Stillness, absence of marketing |
| Surrender | Hesitation, slight vulnerability | Frictionless upload, no judgment |
| Processing | Anticipation, low-grade anxiety | Diegetic loading copy, slow pacing |
| Reveal (early cards) | Disarmed surprise | Specificity, recognition |
| Reveal (mid cards) | Discomfort, recognition deepens | Holding the pace, refusing to soften |
| Reveal (final card) | Stillness, sometimes a small grief | A line that lets the user exit with dignity |
| Aftermath | Reflective, sometimes shareable energy | Quiet exit, single share asset |

The arc is: **curiosity → surrender → recognition → quiet.** Not curiosity → engagement → retention.

---

## 16. Cinematic UX Strategy

The UX is engineered as a three-camera film:

**Camera 1 — Macro frame.** The black/near-black canvas. Always present. Anchors the entity.

**Camera 2 — Typography frame.** Large serif or display type for reveals. Smaller mono type for system voice. Type is the protagonist.

**Camera 3 — Motion frame.** Movement is rare and slow. Fades, not slides. Type rises into place; it does not bounce. Cards do not "swipe."

Cinematic principles applied:
- **Cuts are emotional, not navigational.** Each card is a cut.
- **Negative space is plot.** The empty parts of the screen are doing work.
- **Sound (if present) is diegetic and minimal.** Optional ambient hum, never music.
- **Pace is engineered.** 800–1200ms between transitions, not 200–300ms.

The user should feel like they are inside something, not navigating through something.

---

## 17. Demo Psychology

The hackathon demo has a 90-second window of judge attention. Engineering for that window:

**Second 0–5:** First impression must signal "this is not another AI chat app." The black canvas + single line of type does this.

**Second 5–15:** Upload affordance must be obvious without being loud. One verb. One zone.

**Second 15–35:** Processing must feel intentional, not slow. The diegetic loading copy is the demo's quiet sell — judges read it and realize the product has a voice already.

**Second 35–80:** Reveal sequence must land at least one observation that makes the judge react visibly. This is the hinge of the demo.

**Second 80–90:** Final card and exit must give the judge something to remember. Ideally: a single sentence they could quote back later.

The demo is not about explaining the product. The product explains itself.

---

## 18. Core Wow Moment

The Wow Moment is a single card, delivered roughly mid-sequence, that does this:

> Names a behavioral pattern the user did not consciously articulate, in a sentence short enough to remember, with a specificity that proves the system actually read the artifacts.

Engineering the Wow Moment requires three guarantees:

1. **Specificity guarantee.** The output must reference at least one concrete artifact detail (a song title, a screenshot timestamp, a category of content) — not generic language.
2. **Restraint guarantee.** The sentence is ≤20 words. No qualifiers. No softening.
3. **Resonance guarantee.** The observation maps to a known pattern (avoidance, late-night loop, identity fatigue, etc.) so the user recognizes it even if they hadn't named it.

A single Wow card, reliably produced, is the entire hackathon thesis.

---

## 19. Behavioral Analysis Philosophy

The system reads digital artifacts through a fixed taxonomy of behavioral signals. The taxonomy is not exposed to the user — it is internal to the inference layer.

Primary signal categories (v1):

- **Attention fragmentation:** rapid context switching, short-form loop saturation
- **Late-night patterning:** activity timestamps clustered post-midnight
- **Avoidance signal:** unread messages, unopened apps, unfinished notes
- **Repetition loop:** same song, same creator, same chat, replayed
- **Performative residue:** content saved/shared but never engaged with privately
- **Identity fatigue:** mismatch between curated outputs and private fragments
- **Coping artifacts:** comfort content, regression patterns, nostalgic loops
- **Connection asymmetry:** more outgoing than incoming, or vice versa
- **Numbness markers:** flat affect across high-stimulus inputs

Each artifact is tagged across these dimensions. The reveal layer composes 5–7 sentences that surface the strongest two or three signals, in cinematic language — never in clinical language.

The system never names the taxonomy to the user. The user feels seen; they do not feel categorized.

---

## 20. AI Personality Definition

The voice of SINYAL is a single character. Define it once, hold it everywhere.

**Name (internal):** the entity. Never given a human name in the UI.
**Pronouns:** none. The system never says "I." It also never says "you should."
**Tone:** observational, restrained, intimate, slightly invasive, never warm.
**Register:** literary, not clinical. Specific, not generic.
**Sentence structure:** short. Often subject-led. Periods, not commas.
**Forbidden vocabulary:** "feel like maybe," "it's okay," "you're not alone," "consider," "perhaps," "remember to," "don't forget," "self-care."
**Approved vocabulary:** "noticed," "kept," "returned to," "did not open," "replayed," "saved," "left."

Reference voice (tonal anchor, not imitation): late-period Joan Didion, early Co-Star horoscopes, the narrator of a Paul Schrader film.

The voice is enforced via system prompts, output validation, and a small forbidden-word filter at the edge.

---

## 21. Upload Experience Strategy

Upload is the moment of surrender. It must feel safe, fast, and unjudgmental.

Design rules:

- **One zone.** Drag, tap, or paste — same target.
- **No file-type pedantry.** Accept any common image format. Convert silently.
- **No required minimum.** One image is enough. Ten is the cap.
- **No labeling.** The user does not tag screenshots ("this is TikTok," "this is Spotify"). The system infers source from the image itself.
- **No preview grid that looks like a CMS.** Uploaded items appear as small, dim thumbnails — present but not loud.
- **No progress bars per file.** A single ambient progress signal at the page level.
- **No "are you sure?" friction.** The user commits with one tap.

The upload screen has at most three text strings: a prompt, an instruction, and a continue affordance. Anything more is noise.

---

## 22. Emotional Reveal System

The reveal is a sequence, not a page. It is rendered card by card, each occupying the full screen.

**Card structure:**
- Single sentence, large type, vertically centered.
- Optional small line above (system voice marker, e.g., a date range or a signal label, never a category name).
- No buttons except a single advance affordance.
- Each card has its own pacing: minimum dwell time before advance is allowed (≈1.5s) so users cannot speed through.

**Sequence structure:**
1. Card 1 — Opening observation (broad, sets tone).
2. Cards 2–4 — Behavioral specifics (the Wow card lives here).
3. Cards 5–6 — Pattern synthesis (connects specifics into a shape).
4. Card 7 — Final card (lets the user exit with dignity; never advice).

The sequence is generated as a single structured JSON object — not assembled card-by-card on the fly. This keeps the arc coherent.

---

## 23. Mobile-First Experience Philosophy

SINYAL is built for the phone first. Desktop is a degraded mode.

Mobile design commitments:

- **One-handed operation.** All advance affordances reachable with thumb.
- **Vertical composition.** Cards are vertical-first; desktop letterboxes them.
- **Native paste support.** User can paste a screenshot from clipboard directly.
- **No zoom needed.** Type is sized for reading, not for shrinking.
- **Performance budget for mid-range Android.** Tested on devices like Poco F4 class. No hero animations that drop frames.
- **Dark canvas by default.** Reduces glare and matches the late-night use context.
- **Haptics on reveal.** A single, restrained haptic per card advance (where supported).

The phone is the cinema. The app respects that.

---

## 24. Information Architecture

The IA is intentionally flat. Three surfaces total:

1. **Entry surface.** Landing + upload, one continuous flow.
2. **Reveal surface.** The card sequence.
3. **Aftermath surface.** Exit + single-card share.

There is no:
- Settings page
- Profile page
- History page (in MVP)
- Help page
- About page (a single line at the bottom of the entry surface is enough)

Optional v1.1 surface: a "previous reveals" archive, behind a soft sign-in. Out of MVP scope.

---

## 25. Interaction Philosophy

Six interaction rules:

1. **Tap, not swipe.** Swipes are too casual for the reveal context.
2. **Forward only.** No back button in the reveal sequence. The user cannot un-see.
3. **No skip.** The user can exit, not fast-forward.
4. **No edit.** The user cannot regenerate the reveal in MVP. One reading per session.
5. **No share-to-feed inside the reveal.** Sharing is offered only after the final card.
6. **No micro-interactions for their own sake.** Every motion must carry meaning.

The result: the user feels they are inside an experience that has its own time, not theirs.

---

## 26. Success Metrics

The product has two metric tiers. The hackathon is judged on Tier 1.

**Tier 1 — Emotional metrics (primary):**
- Demo recognition rate: % of judges/testers who visibly react during the reveal (target: ≥80%).
- Wow card hit rate: % of sessions where at least one card meets the Wow criteria (target: ≥70%).
- Quotability: number of sentences in a session a tester would screenshot (target: ≥1).
- Silence-after rate: % of testers who do not immediately speak after the final card (target: ≥50%).

**Tier 2 — System metrics (secondary):**
- Time to first card: ≤25s on mobile broadband.
- End-to-end completion: ≥90% of sessions reach the final card.
- Inference reliability: ≥95% of sessions return a valid structured reveal.
- Demo failure rate: 0 in the demo window.

Tier 2 exists to protect Tier 1.

---

## 27. Hackathon Judging Strategy

The product will be judged on five vectors. Engineering choices map to each:

| Judging Vector | SINYAL's Lever |
|---|---|
| Technical sophistication | Multimodal Gemini pipeline + structured output + voice enforcement |
| Originality | New product category (behavioral mirror) — no direct competitor |
| Design quality | Cinematic UX, restrained typography, motion discipline |
| Emotional impact | The Wow card, designed for a single visible reaction |
| Demo reliability | Pre-baked safe-path inputs, fallback responses, deterministic UI |

The demo script is engineered around vector 4 and protected by vector 5. Vectors 1–3 are the substrate that makes vector 4 credible.

---

## 28. Technical Constraints

Hard constraints for the hackathon build:

- **Mobile-first.** Must run smoothly on a mid-range Android in a browser.
- **No native app.** Web only.
- **Single developer build (Bara) on a Poco F4 + Termux + cloud IDE.** No laptop dependency.
- **Free / low-cost tier.** No paid third-party APIs beyond Google's. Gemini API is the single AI dependency.
- **Google-native deployment.** Cloud Run + GCS only.
- **Demo must work offline-tolerant.** A pre-recorded fallback reveal exists for network failure.

Soft constraints:

- TypeScript everywhere.
- Tailwind v4 + Motion (Framer Motion successor) for UI.
- pnpm for package management.
- Static export where possible; server functions only for inference.

---

## 29. Scope Boundaries

**In scope (MVP):**
- Single-session experience: upload → process → reveal → exit.
- Image artifacts only (1–10 images per session).
- Gemini 2.5 multimodal inference.
- Structured reveal generation.
- Mobile + desktop responsive UI.
- One share asset (single card as image).
- Cinematic loading + reveal flow.

**Out of scope (MVP):**
- Accounts and authentication.
- Persistent history of past reveals.
- Audio uploads.
- Video uploads.
- PDF or text uploads.
- Multi-language output (Bahasa Indonesia is a fast-follow, English MVP first).
- Notifications.
- Social graph features.
- Native mobile app.
- Payments / monetization.

**Explicitly deferred (v1.1+):**
- Soft sign-in for archive.
- Bahasa Indonesia voice.
- Audio artifact ingestion.
- Long-form "season" reveals (week/month/year).

---

## 30. MVP Definition

The MVP is the smallest product that produces the Wow Moment reliably.

**MVP must include:**
1. Entry surface with upload zone.
2. Multimodal inference call to Gemini 2.5.
3. Structured reveal output (5–7 cards, one sentence each).
4. Cinematic reveal sequence on the client.
5. Final card + single-card share asset.
6. Voice enforcement (system prompt + output validator).
7. One fallback path: if inference fails, a pre-baked safe reveal plays.

**MVP must not include anything else.**

The MVP is shippable when a stranger, given a phone, can complete the full experience in under three minutes and visibly react during the reveal.

---

## 31. Future Vision

Post-hackathon roadmap, in priority order:

**v1.1 — Voice expansion.** Bahasa Indonesia output, with the same tonal discipline. This is critical for the actual target user (urban Gen Z Indonesia).

**v1.2 — Archive.** Soft sign-in (Google one-tap). Past reveals stored. No analytics dashboard — just a quiet timeline.

**v1.3 — Season reveals.** Larger artifact sets (30–50 images) processed asynchronously, returning a longer "season" reveal — still cinematic, longer arc.

**v1.4 — Audio artifacts.** Voice notes, voice messages, ambient recordings. Multimodal expansion.

**v2.0 — The standing observer.** Optional persistent ingestion (with strict consent) — the entity watches over time, returns occasional unprompted observations. This is the long-term product.

Monetization is deliberately deferred. The product earns the right to charge by being unforgettable first.

---

## 32. Failure Modes

Product-level failure modes and mitigations:

| Failure Mode | Why It Happens | Mitigation |
|---|---|---|
| Generic output | Model defaults to therapeutic / coaching tone | Aggressive system prompt + forbidden-word filter + few-shot exemplars |
| Hallucinated specifics | Model invents details not in artifacts | Specificity validator: cards must reference observable signals |
| Pacing too fast | Dev instinct optimizes for speed | Hard-coded minimum dwell times in UI |
| Pacing too slow | Loading feels broken | Diegetic loading copy refreshes every 2.5s |
| Over-explaining | Cards drift to two+ sentences | Output schema enforces single-sentence cards |
| Tone collapse | Cards turn warm / sympathetic | Voice validator checks for forbidden vocabulary |
| Demo network failure | Hackathon wifi is unreliable | Pre-baked safe reveal for known demo input |
| Mobile performance jank | Animations drop frames | Motion budget + reduced-motion path |

---

## 33. Emotional Risk Analysis

SINYAL deals with intimate emotional territory. Three risks must be managed:

**Risk 1 — The wrong kind of accuracy.**
The system might surface something genuinely painful — a recent loss, a relationship pattern, a depressive marker. Mitigation: the final card is always a stabilizer. It does not advise, but it does not leave the user mid-fall. The voice protocol forbids accusations.

**Risk 2 — The performative trap.**
Users may treat reveals as content for social posting, hollowing the emotional contract. Mitigation: share asset is a single card with restrained typography — beautiful but not viral-optimized. No watermarks pushing brand.

**Risk 3 — The therapy substitution.**
Users may use SINYAL in place of real support. Mitigation: a single, quiet line in the aftermath surface — not a disclaimer, but an acknowledgment that the system is not a substitute for human care. One sentence. Once.

The product is honest about what it is: a mirror, not a hand.

---

## 34. Demo Failure Prevention

A separate, explicit checklist — the demo cannot fail:

- **Pre-baked safe inputs.** A test set of 10 screenshots that are known to produce a strong reveal. Used in the demo.
- **Pre-baked safe output.** A cached structured reveal that maps to those screenshots. If inference fails, this is rendered instead, indistinguishable from a live run.
- **Network independence path.** The reveal can render from cached state if the API is unreachable mid-session.
- **One-tap demo mode.** A hidden URL parameter that bypasses upload and goes straight to the cached reveal — for emergencies.
- **No auth, no DB, no third-party services in the critical path.** Anything that can fail is removed from the demo path.
- **Pre-warmed Cloud Run instance.** Min instances ≥1 during the demo window to avoid cold starts.
- **Local device fallback.** Demo runs on the developer's phone, not on the venue wifi if possible — tether from a known-good network.

The demo is an engineered artifact, not a hope.

---

## 35. Why SINYAL Can Win

A clear-eyed case:

**1. Category clarity.** Every other AI hackathon submission is a chatbot, a wrapper, a productivity tool, or a coding assistant. SINYAL is none of those, and the difference is legible in the first five seconds.

**2. Emotional defensibility.** The Wow Moment is a moat. It is hard to engineer, requires multimodal reasoning, prompt discipline, and design taste in equal measure. Most teams will not have all three.

**3. Cinematic design as proof of taste.** Judges who have seen 40 demos will register the visual restraint immediately. It signals that the team made decisions, not just features.

**4. Technical depth, hidden under emotional surface.** Underneath the quiet UI is a real multimodal inference pipeline with structured output, voice enforcement, and reveal composition. That depth becomes visible in Q&A.

**5. Demo engineering.** Pre-baked safe paths and fallback rendering mean the product cannot fail in the demo window. Most teams skip this. SINYAL treats it as a first-class concern.

**6. Story.** A single developer, mobile-only, building a behavioral mirror in a category that didn't exist before the weekend. That is the kind of story judges remember.

The product wins not by having the most features, but by being the only one of its kind in the room — and by working perfectly in the 90 seconds that matter.

---

*End of PRD.*
