# SINYAL — System Design Document

> Implementation-aware architecture for a cinematic AI-native behavioral mirror.

**Document Version:** 1.0
**Status:** Source of Truth — Pre-Implementation
**Audience:** Engineers, technical reviewers, hackathon judges
**Companion document:** [PRD.md](./PRD.md)

---

## 1. System Overview

SINYAL is a thin, cinematic web application backed by a single multimodal inference pipeline. The system has three logical layers:

1. **Client (Next.js 15 / React 19 / Tailwind v4 / Motion)** — renders the cinematic flow, manages upload, and orchestrates reveal pacing. The client is the cinema.
2. **Inference Service (Cloud Run, Node.js)** — a single stateless service that receives uploaded artifacts, orchestrates Gemini calls, validates structured output, and returns a reveal payload. The service is the mirror.
3. **Google AI (Gemini 2.5 Flash + Pro)** — the multimodal reasoning core. The model is the eye.

There is no traditional database in the MVP. There is no user account system. There is no analytics pipeline. The system is engineered to be small, fast, and emotionally precise.

```
[Client / Next.js]
   │  (multipart upload + session id)
   ▼
[Cloud Run / Node.js inference service]
   │  (signed-URL upload to GCS, then Gemini call)
   ▼
[Google Cloud Storage]    [Gemini 2.5 Flash / Pro]
                                 │
                                 ▼
                        [Structured JSON reveal]
                                 │
                                 ▼
                        [Validator + voice filter]
                                 │
                                 ▼
                        [Client renders reveal]
```

---

## 2. Architecture Philosophy

Five architectural commitments:

**1. Smallest possible surface area.**
One client, one service, one model. No queues, no workers, no databases, no auth, no microservices. Every removed component is a removed failure mode.

**2. Stateless by default.**
The service holds no session state. Each request carries everything needed to produce a reveal. State lives in the client during a session, and dies with it.

**3. Edge-of-model pacing.**
Latency is shaped by the client, not the server. The model returns as fast as it can; the client paces the reveal cinematically. This decouples user experience from inference time.

**4. Determinism at the boundary.**
The model is non-deterministic; the boundary is not. Output is validated, sanitized, and shaped before it ever reaches the client. The client only ever renders well-formed reveals.

**5. Demo-grade reliability over scale.**
The system is optimized for one perfect run, not a million good runs. Every architectural choice is checked against: "does this make the demo more or less likely to succeed?"

---

## 3. Frontend Architecture

**Framework:** Next.js 15 (App Router), React 19, TypeScript strict mode.
**Styling:** Tailwind CSS v4, with a tiny custom design token layer.
**Motion:** Motion (the Framer Motion successor library).
**Build:** Static export where possible (`output: "export"`), with a single dynamic edge for the inference call.
**Package manager:** pnpm.

**Top-level structure:**

```
app/
  (entry)/
    page.tsx              // Approach + Surrender (upload)
  reveal/
    page.tsx              // Reveal sequence
  share/[id]/
    page.tsx              // Single-card share asset (OG image)
components/
  cinema/                 // CardStage, Backdrop, Cursor, Pacer
  upload/                 // DropZone, PasteCapture, Thumbs
  voice/                  // Loader phrases, system voice strings
  reveal/                 // RevealCard, AdvanceAffordance, FinalCard
lib/
  inference/              // client of /api/reveal
  validators/             // reveal schema + voice filter
  pacing/                 // dwell-time controller
  haptics/                // mobile haptic helpers
  types/                  // shared TS types
state/
  session.ts              // useSession (Zustand or React context)
  reveal.ts               // useReveal (cards, currentIndex, state machine)
public/
  fallback/               // pre-baked safe reveal payload + image
```

**Rendering model:**
- Entry surface: static, no JS state on first paint.
- Reveal surface: client component, hydrates with session payload.
- Share surface: server component (Next image generation) for OG cards.

**Key rule:** the client never trusts model output without running it through `lib/validators` first.

---

## 4. Backend Architecture

**Runtime:** Node.js 20 on Cloud Run.
**Framework:** Hono (chosen over Express for size, speed, and edge-style ergonomics).
**Concurrency:** Cloud Run default (80 per instance), adjusted down to 20 during demo to keep tail latency tight.
**Min instances:** 1 during demo window, 0 otherwise.
**Memory:** 1 GiB.
**CPU:** 2 vCPU.
**Timeout:** 60s request timeout (Gemini calls capped at 30s).

**Service responsibilities (only these, nothing more):**

1. Accept multipart uploads (1–10 images, ≤10MB each, image/* only).
2. Stream uploads into Google Cloud Storage with a session-scoped prefix.
3. Compose the Gemini request: system prompt + few-shot exemplars + user artifacts (as inline image parts) + structured output schema.
4. Call Gemini, with timeout and retry.
5. Validate the structured response against the reveal schema.
6. Run the voice filter.
7. Return the reveal payload to the client.
8. Schedule artifact deletion from GCS (TTL via lifecycle rule, default 1 hour).

The service does not log artifact contents, does not persist reveals, does not authenticate users. It is a pipe with intelligence in the middle.

---

## 5. AI Inference Pipeline

The pipeline is a single linear sequence with one deterministic branch (Flash vs Pro). No DAG, no orchestration framework.

```
[Receive request]
   ↓
[Validate inputs: count, mime, size]
   ↓
[Upload to GCS (parallel) → get signed URIs]
   ↓
[Compose Gemini request]
   - system_instruction (fixed)
   - few-shot exemplars (3 worked examples)
   - user images (inline)
   - response_schema (structured JSON)
   ↓
[Choose model]
   - Default: Gemini 2.5 Flash
   - If artifact_count ≥ 6 OR signal_complexity heuristic high: Gemini 2.5 Pro
   ↓
[Call Gemini with 30s timeout]
   ↓
[Parse structured output]
   ↓
[Validate against schema]
   ↓
[Run voice filter]
   ↓
[If invalid → one repair retry with stricter prompt]
   ↓
[If still invalid → return fallback safe reveal]
   ↓
[Return payload to client]
```

The pipeline has exactly one place where retry happens (the repair step). One retry, not exponential backoff. The user is waiting; the demo cannot stall.

---

## 6. Gemini Integration Strategy

**Model selection:**
- **Gemini 2.5 Flash** — primary path. Fast, cheap, strong multimodal grounding. Used for ≤5 artifact sessions.
- **Gemini 2.5 Pro** — secondary path. Used when artifact count is high or the Flash output fails validation on first try.

**Why both:** Flash carries the demo (latency), Pro carries the edge cases (depth). The cost differential is acceptable at hackathon scale.

**Request shape:**
- `system_instruction`: the SINYAL voice contract (see §32).
- `contents[0]`: user turn containing inline image parts and a fixed prompt scaffold.
- `generation_config.response_mime_type`: `application/json`.
- `generation_config.response_schema`: the reveal schema (see §11).
- `generation_config.temperature`: 0.7 — high enough for voice, low enough for stability.
- `generation_config.top_p`: 0.9.
- `safety_settings`: default — the product is intimate, not unsafe; no need to loosen.

**Streaming:** disabled. The reveal is rendered as a sequence on the client; partial payloads add no value and complicate validation.

**Caching:** off in MVP. Each session is treated as fresh.

**Failure handling:** detailed in §31.

---

## 7. Multimodal Processing Flow

The system treats user uploads as an unstructured multimodal corpus. Pre-processing is minimal — we let Gemini do the reading.

**Steps before the model sees the artifacts:**

1. **Server-side image normalization.** Convert HEIC → JPEG. Re-encode oversized images to a max 1600px long edge to keep token cost manageable without losing legibility.
2. **Order preservation.** Images are sent in upload order — the order is sometimes meaningful (a screenshot sequence).
3. **No OCR pre-pass.** Gemini handles OCR natively. A separate OCR step would lose layout context.
4. **No classification pre-pass.** The model is asked to identify the platform/source itself, as part of its reasoning.

**What the model is asked to extract (internally):**
- Source platform of each artifact (TikTok, Spotify, WhatsApp, Notes, etc.).
- Salient text snippets (song titles, message fragments, captions).
- Temporal markers (timestamps, time-of-day cues).
- Affective signals across the taxonomy in PRD §19.
- Cross-artifact patterns (recurring creators, repeated themes, asymmetries).

The extraction is implicit — the model is not asked to dump a feature table. It is asked to read, then to write reveals grounded in what it read.

---

## 8. Upload Processing Pipeline

**Client side:**

1. User drops/taps/pastes 1–10 images.
2. Client validates: image/*, ≤10MB each, ≤10 total.
3. Client generates a session id (UUIDv4) — held only in memory.
4. Client requests a batch of GCS signed upload URLs from `/api/upload-urls` (one per file).
5. Client uploads files directly to GCS using the signed URLs (parallel, with a small concurrency cap).
6. Client posts file metadata (paths only — no contents) to `/api/reveal` with the session id.

**Server side (`/api/reveal`):**

1. Verify all referenced GCS objects exist and are within the session prefix.
2. Read objects, normalize, and pack into the Gemini request.
3. Run the inference pipeline (§5).
4. Return the reveal payload.
5. Issue a deletion job for the session prefix (or rely on bucket lifecycle).

**Why direct-to-GCS uploads:** keeps the Cloud Run service free of large multipart parsing, reduces bandwidth on the service tier, and isolates user data on a storage path with a short TTL.

---

## 9. Behavioral Reconstruction Engine

The "engine" is not a separate microservice. It is a layered prompt + schema + validator design that runs inside the inference call.

**Three internal layers, executed in a single Gemini call:**

**Layer A — Read.**
The model identifies platform sources and extracts salient artifacts (song titles, message fragments, timestamps, content categories).

**Layer B — Pattern.**
The model maps observations onto the SINYAL behavioral taxonomy (PRD §19). It identifies the two or three strongest signals.

**Layer C — Reveal.**
The model composes a 5–7 card reveal sequence in the SINYAL voice, grounded in specifics from Layer A and shaped by patterns from Layer B.

**Why a single call:** chaining adds latency and introduces drift. A single well-engineered prompt with a structured output schema produces all three layers atomically.

**The structured output (returned to the server):**

```jsonc
{
  "session_meta": {
    "artifact_count": 5,
    "primary_signals": ["late_night_loop", "avoidance"],
    "model_used": "gemini-2.5-flash"
  },
  "observations": [
    { "source": "tiktok",   "note": "..." },
    { "source": "spotify",  "note": "..." }
  ],
  "cards": [
    { "kind": "opening",   "text": "..." },
    { "kind": "specific",  "text": "..." },
    { "kind": "specific",  "text": "..." },
    { "kind": "specific",  "text": "..." },
    { "kind": "synthesis", "text": "..." },
    { "kind": "synthesis", "text": "..." },
    { "kind": "final",     "text": "..." }
  ]
}
```

The `observations` array is internal — it is logged for debugging but not rendered to the user. The `cards` array is the product.

---

## 10. Emotional Inference Layer

The emotional layer is implemented as **prompt scaffolding** — not as a separate model, classifier, or rule engine.

**Components of the scaffolding:**

1. **The voice contract** (system instruction): defines who the entity is, what it can and cannot say.
2. **The taxonomy primer**: a compressed description of the nine signal categories from PRD §19, written in the entity's voice.
3. **Three few-shot exemplars**: hand-crafted (artifact summary → reveal cards) pairs that demonstrate specificity, restraint, and the card sequence shape.
4. **The schema**: forces the output into a fixed structure.
5. **The forbidden-vocabulary reminder**: a tail-end instruction listing what cannot appear in card text.

The exemplars are the most important component. They do more work than any rule. The exemplars are versioned in `prompts/exemplars/` and reviewed manually when changed.

---

## 11. Structured Output System

Output is validated against a strict JSON schema. The schema doubles as the Gemini `response_schema`.

**Schema (TypeScript-flavored description):**

```ts
type Source = "tiktok" | "spotify" | "whatsapp" | "notes" | "screentime" | "feed" | "other";

type CardKind = "opening" | "specific" | "synthesis" | "final";

interface RevealCard {
  kind: CardKind;
  text: string;          // 6–22 words, single sentence, ends with "."
}

interface RevealPayload {
  session_meta: {
    artifact_count: number;       // 1..10
    primary_signals: string[];    // 1..3 from taxonomy
    model_used: "gemini-2.5-flash" | "gemini-2.5-pro";
  };
  observations: { source: Source; note: string }[];   // internal, not rendered
  cards: RevealCard[];                                // 5..7 items
}
```

**Validation rules (server-side, after model call):**

- `cards.length` between 5 and 7.
- Exactly one `opening`, exactly one `final`, the rest are `specific` or `synthesis`.
- Each `text` is one sentence, 6–22 words, no semicolons, no emoji, ends with a period.
- Voice filter: no forbidden vocabulary (PRD §20).
- Specificity check: at least two `specific` cards must contain a token that appears in the observations array (a song, a creator, a time-of-day word, etc.).

If any rule fails, the inference pipeline triggers a single repair retry (§31).

---

## 12. Reveal Card Rendering System

**Component:** `<RevealCard />`
**Layout:** full-screen, vertically centered, single sentence in display type.
**Type scale:** clamp(28px, 6.5vw, 56px). Line-height tight (1.05–1.15).
**Motion in:** opacity 0 → 1 over 600ms; type rises 8px → 0px on the same curve.
**Motion out:** opacity 1 → 0 over 400ms before next card mounts.
**Dwell minimum:** 1500ms before the advance affordance becomes interactive.
**Advance affordance:** a thin underline at the bottom of the screen with a quiet label ("continue"). Tap-target full width, 80px tall.

**Card kinds, visually:**
- `opening`: type slightly smaller, more breathing room above.
- `specific`: default treatment.
- `synthesis`: a single thin horizontal hairline above the text, signaling "this is bringing things together."
- `final`: type centered higher on screen, leaving room below for an exit affordance.

**No images on cards.** No icons. No counters ("3 of 7"). The user does not need to know how many cards remain.

---

## 13. Cinematic State Flow

The reveal surface is a finite state machine. Eight states:

```
idle
  → loading     (inference in flight)
  → ready       (payload received, first card primed)
  → playing     (card visible, dwell timer running)
  → advancing   (card fading out, next card preloading)
  → final       (last card visible)
  → exiting     (user taps exit; share asset prepared)
  → error       (inference failed; fallback or recovery shown)
```

**Transitions are timed, not user-controlled, except `playing → advancing → playing` which the user advances by tap (after dwell).**

**Why an explicit FSM:** prevents race conditions where users tap twice during a fade and skip a card; prevents the loader and the reveal from briefly overlapping; makes the exit path testable.

Implementation: a small reducer in `state/reveal.ts`, no external FSM library needed.

---

## 14. UI Rendering Architecture

**Component hierarchy (top down):**

```
<App>
  <Backdrop />              // global black canvas, full viewport, fixed
  <NoiseLayer />            // subtle film grain, opacity ≤ 0.04
  <Route>
    <EntrySurface />        // landing + upload
    <RevealSurface>
      <Pacer />             // owns dwell timing, exposes canAdvance
      <CardStage>           // mounts the current card
        <RevealCard />
      </CardStage>
      <AdvanceAffordance />
    </RevealSurface>
    <ShareSurface />        // OG share asset
  </Route>
  <ReducedMotionGuard />    // disables non-essential animation if prefers-reduced-motion
</App>
```

**Rendering rules:**
- The Backdrop never unmounts. Color and noise are constant across routes.
- Only one card is mounted at a time. No card carousel, no off-screen pre-renders that drift.
- Type rendering uses `font-display: block` for the chosen serif/display face — we accept FOIT to avoid swap flicker on the first card.

---

## 15. Animation System Design

Motion is governed by a small token system, not improvised per component.

**Tokens (in `lib/motion/tokens.ts`):**

```ts
export const motion = {
  durations: { fast: 200, base: 400, slow: 600, dwell: 1500 },
  easings: {
    quiet:  [0.22, 0.61, 0.36, 1],   // for fades and rises
    settle: [0.16, 1, 0.3, 1],       // for resting motions
  },
  rises: { sm: 4, md: 8, lg: 16 },
};
```

**Motion rules:**
- All motion uses `quiet` or `settle` easing. No bounces. No springs.
- All motion is opacity + transform. No layout-affecting animation.
- All motion respects `prefers-reduced-motion: reduce` — replaced with instant transitions of equal duration's quarter, holding emotional pacing through dwell time.
- No parallax. No 3D. No video backgrounds.

**Non-motion atmosphere:**
- A single static film-grain layer (CSS or tiny PNG) at low opacity provides texture without animation cost.

---

## 16. Mobile Optimization Strategy

Mobile is the primary target. Optimizations:

- **Bundle budget:** ≤180KB gzip on the entry route. Reveal route can be heavier (≤260KB) since it loads after intent.
- **Font loading:** one display face (subset to Latin + a few extended characters), one mono face for system voice. Self-hosted, `font-display: block` on display, `swap` on mono.
- **Image handling:** uploads are downscaled client-side to ≤1600px before upload to GCS, saving bandwidth and Gemini token cost.
- **Network:** all critical-path requests use `keepalive` where possible. The reveal payload is the only required network round-trip beyond uploads.
- **Touch targets:** advance affordance is a full-width band ≥80px tall. No tiny dots.
- **Haptics:** a single `navigator.vibrate(8)` per advance on supported devices, gated behind a user-gesture context.
- **Safe areas:** type and affordances respect `env(safe-area-inset-*)`. The product looks intentional on notched and bezel-less phones.

---

## 17. State Management

The smallest store that does the job. No Redux, no global state libraries beyond a tiny one.

**Choice:** Zustand for global session/reveal state; React local state for component concerns.

**Stores:**

```
state/session.ts
  - sessionId: string
  - artifacts: { id, name, size, gcsPath }[]
  - status: 'idle' | 'uploading' | 'inferring' | 'ready' | 'error'

state/reveal.ts
  - payload: RevealPayload | null
  - currentIndex: number
  - phase: 'loading' | 'ready' | 'playing' | 'advancing' | 'final' | 'exiting' | 'error'
  - dwellEndsAt: number | null
```

**Persistence:** none in MVP. State dies with the tab.

---

## 18. API Architecture

Two endpoints, both on the Cloud Run service. Both return JSON. No GraphQL, no tRPC, no SDK.

### `POST /api/upload-urls`

**Request:**
```json
{ "sessionId": "uuid", "files": [{ "name": "a.jpg", "type": "image/jpeg", "size": 482011 }] }
```

**Response:**
```json
{ "uploads": [{ "name": "a.jpg", "url": "https://storage.googleapis.com/...signed", "objectPath": "sessions/uuid/a.jpg" }] }
```

**Rules:** ≤10 files. Each ≤10MB. Mime must be image/*. Signed URLs valid for 5 minutes.

### `POST /api/reveal`

**Request:**
```json
{ "sessionId": "uuid", "objectPaths": ["sessions/uuid/a.jpg", "..."] }
```

**Response:** a `RevealPayload` (§11). The `observations` field is included for debugging and stripped at the client edge before rendering.

**Errors:** all returned as JSON with shape `{ error: { code, message } }`. Never HTML. The client renders the fallback path on any non-200.

---

## 19. Error Handling Philosophy

The product cannot show a stack trace. It cannot show a generic "Something went wrong." Errors are absorbed into the cinema.

**Three failure tiers:**

**Tier 1 — Recoverable inference issues.**
Schema validation fails, voice filter trips, etc. Handled invisibly by the repair retry. The user sees nothing different.

**Tier 2 — Hard service failures.**
Cloud Run unreachable, Gemini timeout twice, GCS unavailable. The client shifts to the fallback path: a pre-baked safe reveal renders, indistinguishable in UI from a live one. A small marker is logged client-side for telemetry.

**Tier 3 — Catastrophic client failures.**
Unhandled exceptions during reveal. A single calm message replaces the card: "the signal broke. try again later." No stack, no retry button, no apology copy. Failure is part of the voice.

**Logging:** server logs error categories without artifact contents or reveal text. Privacy first.

---

## 20. Performance Optimization

Targets:
- **TTFB on entry:** ≤300ms from edge.
- **First card on screen:** ≤1.5s after upload completion, in the median.
- **Reveal payload size:** ≤6KB.
- **Cloud Run cold start:** ≤2s with min-instances=1 during demo.
- **End-to-end (median):** upload (3s) + inference (8–14s) + render (1s) ≈ 12–18s.

Levers:
- Static export for entry surface.
- Direct-to-GCS uploads (off the Cloud Run path).
- Gemini Flash as default model.
- Single round-trip for inference (no streaming, no chains).
- Aggressive font subsetting and self-hosting.
- Critical CSS inlined for the entry surface only.

What we are not optimizing:
- Multi-region failover. Single region (asia-southeast1 or us-central1, chosen by Gemini latency from the demo venue).
- CDN edge caching of dynamic responses. Reveals are session-specific and not cached.

---

## 21. Security Considerations

The product handles sensitive emotional input. Security posture:

- **Transport:** HTTPS everywhere, HSTS preload-eligible headers.
- **Uploads:** signed URLs with 5-minute expiry, scoped to a session prefix. No public-read on the bucket.
- **Service auth:** the Cloud Run service is publicly invokable (no auth) since the MVP has no user accounts. Rate limits compensate.
- **Rate limiting:** simple IP-based limit at the service edge — 20 requests/hour per IP for `/api/reveal`. Sufficient for MVP and demo.
- **CORS:** `Access-Control-Allow-Origin` restricted to the production domain and the dev preview domain.
- **Secrets:** Gemini API key in Google Secret Manager, mounted as env in Cloud Run.
- **Input validation:** strict mime/size checks before signed URL issue and again on read.
- **Output sanitization:** card text is rendered with strict escaping; the renderer never `dangerouslySetInnerHTML` reveal content.
- **No PII storage:** uploads are deleted within 1 hour via bucket lifecycle. Reveals are not stored at all.

The product is not a security product, but the privacy posture is the brand.

---

## 22. Privacy Philosophy

Privacy in SINYAL is not a compliance checkbox; it is part of the emotional contract.

Commitments:

1. **No persistence by default.** Uploads expire within 1 hour. Reveals are never written to disk on the server.
2. **No analytics on content.** The product does not track which screenshots are uploaded, what cards are generated, or what the user shares.
3. **Telemetry is minimal and anonymous.** Counts of sessions, latency percentiles, error categories. Nothing else.
4. **No third-party trackers.** No GA, no Hotjar, no Sentry replay, no PostHog session recording.
5. **Logs are scrubbed.** Server logs include error codes and timing, never artifact contents or reveal text.
6. **Visible privacy line.** A single sentence on the entry surface acknowledges the policy. No long privacy modal.

Future versions with sign-in will add explicit consent for archive storage. MVP does not need it.

---

## 23. Google Cloud Architecture

A minimal Google Cloud footprint:

```
[Cloudflare (DNS + TLS, optional)]    or [Google Cloud Load Balancer]
                  │
                  ▼
        [Cloud Run service: sinyal-api]
         - region: us-central1 (or asia-southeast1)
         - min instances: 0 (1 during demo)
         - max instances: 5
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
[Google Cloud Storage]   [Gemini API (AI Studio key)]
  bucket: sinyal-uploads
  lifecycle: 1h delete
```

**Project structure:**
- One GCP project (`sinyal-prod`).
- One service account for Cloud Run (`sinyal-api@…`) with: GCS object admin on the uploads bucket, secret accessor for the Gemini key.
- One bucket (`sinyal-uploads`) with: uniform bucket-level access, public access prevention enforced, lifecycle rule deleting objects older than 1 hour.
- Gemini API access via API key stored in Secret Manager.

No VPC, no Cloud SQL, no Pub/Sub, no Workflows. Deliberate restraint.

---

## 24. Cloud Run Deployment Strategy

**Container:** Distroless Node.js base image. Bundle the service with esbuild into a single JS file to keep the image ≤80MB.

**CI/CD:** GitHub Actions on push to `main`:

```
build → docker build → push to Artifact Registry → gcloud run deploy
```

**Deployment safety:**
- Always deploy to a new revision; route 100% only after smoke test.
- A smoke-test job calls `/api/reveal` with a fixed test payload after each deploy.
- Roll back to previous revision automatically if smoke fails.

**Demo deployment routine:**
1. Freeze the deployment 12 hours before the demo.
2. Set min-instances to 1.
3. Run a manual end-to-end check from a phone on the demo network.
4. Pre-warm by sending a real test reveal one hour before the demo slot.
5. Keep the previous revision pinned and ready for instant rollback.

**Environments:**
- `prod` — the demo environment.
- `preview` — auto-deployed for branches; used for design review.
- No staging in MVP (it would not be exercised enough to be trustworthy).

---

## 25. Gemini API Orchestration

Orchestration is a single function, `runRevealInference(input)`, in `services/inference.ts`. It is the only place that calls the Gemini SDK.

**Function shape:**

```
runRevealInference(input):
  1. preflight: ensure all GCS objects exist and are readable
  2. load images into memory (≤10 files, capped 10MB each)
  3. compose request:
       - system_instruction = VOICE_CONTRACT
       - contents = [PROMPT_SCAFFOLD, ...inlineImageParts]
       - generation_config = { response_mime_type, response_schema, temperature, top_p }
  4. select model:
       primary = "gemini-2.5-flash"
       if heuristics.complex(input) then primary = "gemini-2.5-pro"
  5. call Gemini with timeout=30s
  6. parse JSON
  7. validate against schema and voice filter
  8. if invalid:
       compose repair request (adds: "the previous attempt violated rules X, Y; fix and return again")
       retry once
  9. if still invalid: return FALLBACK_REVEAL
 10. return payload
```

**Determinism aids:**
- The system instruction, prompt scaffold, and exemplars are versioned constants in `prompts/`.
- Schema and voice filter live next to the function and are unit-tested.

---

## 26. Storage Strategy

**Single bucket:** `sinyal-uploads`.
**Object path:** `sessions/{sessionId}/{filename}`.
**Lifecycle:** delete objects ≥1 hour old. No archival tier.
**Access:** signed URLs only. No public objects, no IAM grants to end users.
**Versioning:** off. No need.

**No database.** Reveals are computed and returned; nothing is written. If a v1.1 archive is added, a single table in Firestore would suffice — out of MVP scope.

---

## 27. Scalability Boundaries

This is a hackathon-scale system. Honest limits:

- **Concurrent sessions:** ≤50 simultaneous on default Cloud Run quota.
- **Daily sessions:** ≤2,000 within Gemini free/low-tier quota.
- **Image throughput:** ≤20,000 images/day across all sessions before quota concerns.
- **Geographic distribution:** single region. No global edge.

What would need to change to scale 100×:
- Multi-region Cloud Run with global load balancing.
- Quota negotiation with Google for Gemini.
- A queue (Cloud Tasks) in front of inference for burst smoothing.
- A real cache for repeat artifact hashes (privacy implications must be reconsidered).

The MVP intentionally does not solve scale. Solving it now would dilute the demo.

---

## 28. Technical Debt Boundaries

Acceptable debt for the MVP:

- No automated end-to-end test suite (manual demo rehearsal substitutes).
- No retry queue for failed deletions in GCS (lifecycle rule cleans up).
- No structured analytics (error codes only).
- No A/B framework for prompts (versioning + manual review substitutes).
- No CI on the prompts directory (manual review substitutes).

Unacceptable debt (must be paid before demo):

- Voice filter must have unit tests.
- Schema validator must have unit tests.
- Fallback path must be exercised at least once on the production environment.
- Reduced-motion path must be verified manually.

---

## 29. Future Expansion Strategy

Architectural seams designed in now, exercised later:

**Seam 1 — Model abstraction.**
The inference function receives a `model` parameter. Adding a third model (or swapping providers, if ever needed) is a one-file change.

**Seam 2 — Artifact source abstraction.**
Inputs are typed as `Artifact[]` with a `kind` field. Adding audio/text/video artifacts requires extending the type, not rewriting the pipeline.

**Seam 3 — Voice abstraction.**
The voice contract and exemplars are loaded from versioned files. Adding a Bahasa Indonesia voice means adding a parallel set, not editing the engine.

**Seam 4 — Persistence abstraction.**
Reveals are returned as immutable payloads. Adding archive storage means writing the same payload to Firestore — no transformation.

**Seam 5 — Pacing abstraction.**
The client `Pacer` exposes hooks for dwell time, advance gating, and final-card behavior. A v1.3 "season reveal" with longer arcs reuses the same component.

These seams cost nothing today and unlock the v1.1–v2.0 roadmap cleanly.

---

## 30. Logging & Monitoring

**Server logs (Cloud Logging):**
- Request id, route, status code, duration.
- Inference: model used, validation outcome, repair-retry occurred yes/no, fallback triggered yes/no.
- Errors: category and stack (no payload contents).

**Client telemetry:**
- Page-view counts (anonymous).
- Reveal completion rate.
- Fallback render count.
- Reduced-motion path hit count.

**Monitoring:**
- Cloud Run uptime check on `/healthz`.
- A single dashboard with: requests/min, p50/p95 latency, error rate, fallback rate, Gemini call success rate.
- One alert: error rate > 5% over 5 minutes pages the developer.

No paid observability in MVP. Cloud Logging + a hand-built dashboard suffices.

---

## 31. Fallback AI Response Strategy

The fallback exists at three levels:

**Level 1 — Repair retry (model-level fallback).**
First call fails validation → second call with stricter, repair-oriented prompt. Handled inside `runRevealInference`. Invisible to user.

**Level 2 — Pre-baked safe reveal (service-level fallback).**
Both calls fail or Gemini is unreachable → service returns a curated reveal payload that has been hand-validated to feel cinematic and non-generic. Indistinguishable from a real reveal in the UI.

**Level 3 — Client cached fallback (network-level fallback).**
Service is unreachable entirely → client renders a bundled fallback payload from `public/fallback/reveal.json`. Used only for the demo bypass URL parameter and for catastrophic network failure.

**Fallback content design:** the fallback reveal is intentionally written so that even if it fires for a user with no real artifacts, it still feels coherent. It addresses general patterns of late-night digital behavior. It is not bland — it is engineered to land.

---

## 32. Prompt Engineering System

**Files:**

```
prompts/
  voice_contract.md          // system instruction, the entity definition
  scaffold.md                // user-turn prompt skeleton
  exemplars/
    01_late_night_loop.md
    02_avoidance_pattern.md
    03_identity_fatigue.md
  forbidden_words.json       // for both prompt tail and validator
```

**Voice contract structure:**
- Identity ("you observe; you do not advise").
- Tone ("restrained, intimate, slightly invasive").
- Forbidden vocabulary (explicit list).
- Output rules ("one sentence per card; 6–22 words; no emoji; period at end").
- Card sequence rules (kinds, counts, ordering).

**Exemplars:**
Each exemplar is a triple — (artifact summary, primary signals, full reveal payload). Three is enough; four starts to crowd the context.

**Versioning:**
The `prompts/` directory is version-controlled. Each release of the service is tagged with the prompt commit. A regression in voice quality can be bisected.

---

## 33. Emotional Output Validation

Validation is a small, ruthless module: `lib/validators/voice.ts`.

**Checks, in order:**

1. **Schema check** (zod or similar): structure, counts, kinds.
2. **Length check**: each card text 6–22 words.
3. **Punctuation check**: ends with `.`; no `;`; no `!`.
4. **Emoji check**: regex against unicode emoji ranges; reject if any.
5. **Forbidden vocabulary check**: case-insensitive substring match against `forbidden_words.json`.
6. **Specificity check**: at least two `specific` cards must contain a token (≥4 chars) that also appears in any `observations[].note`.
7. **Final-card stabilizer check**: final card must not contain accusative verbs ("avoiding," "ignoring," "running") in second-person form.

Failing any check → repair retry. Failing twice → fallback.

This is the unsexy module that protects the brand. It earns its keep on demo day.

---

## 34. Design System Architecture

A small token system, not a component library. The product is too small to justify a Storybook.

**Tokens:**

```
tokens/
  color.ts        // canvas, ink, hairline, accent (rare), grain
  type.ts         // display, body, mono — sizes and line-heights
  space.ts        // 4px scale
  motion.ts       // see §15
  z.ts            // small set: backdrop, content, overlay
```

**Color palette (locked, MVP):**
- Canvas: `#0A0A0B`
- Ink (primary type): `#EDEAE3`
- Hairline: `#26252A`
- System voice mono: `#8C8A85`
- Accent (used only on final-card affordance): `#C9A24A`
- Grain: a single 256×256 PNG at opacity 0.03

**Typography:**
- Display: a serif with character — candidates include "Fraunces" or "Source Serif 4." Final choice locked after a typography test session.
- Mono: "JetBrains Mono" for system voice marks.
- Body: same display serif at smaller size for the entry copy. No second sans-serif — sans-serif fights the cinema.

---

## 35. Component Hierarchy

The complete component map:

```
App
├── Backdrop
├── NoiseLayer
├── Routes
│   ├── EntrySurface
│   │   ├── Headline
│   │   ├── DropZone
│   │   │   ├── DropTarget
│   │   │   ├── PasteCapture
│   │   │   └── ThumbStrip
│   │   ├── ContinueAffordance
│   │   └── PrivacyLine
│   ├── RevealSurface
│   │   ├── Pacer
│   │   ├── Loader (active during inference)
│   │   │   └── DiegeticPhrase
│   │   ├── CardStage
│   │   │   └── RevealCard (one of: Opening, Specific, Synthesis, Final)
│   │   └── AdvanceAffordance
│   └── ShareSurface
│       ├── ShareCardImage
│       └── ExitAffordance
└── ReducedMotionGuard
```

This map is small enough to fit in one head. That is the goal.

---

## 36. Reveal Engine Architecture

The Reveal Engine is the client-side conductor of the cinema. It is a small set of pieces:

**Pieces:**

1. **`useReveal()`** — exposes `payload`, `currentIndex`, `phase`, `advance()`, `exit()`.
2. **`<Pacer>`** — wraps the stage; manages dwell timing; emits `canAdvance` to the affordance.
3. **`<CardStage>`** — mounts exactly one card; handles enter/exit transitions; ensures only one card is visible at a time.
4. **`<AdvanceAffordance>`** — disabled during dwell, enabled after; fires `advance()` on tap.
5. **`<Loader>`** — owns the diegetic phrase rotation during inference; transitions out smoothly when `payload` arrives.
6. **`<FinalCard>`** — special case that mounts the exit + share affordances after its own dwell.

**Flow contract:**
- Inference completes → `phase: 'ready'` → first card auto-plays after a 600ms beat.
- During `playing`, dwell timer runs; advance is gated until it elapses.
- On advance: transition to `advancing` (current card fades out), then mount next card and re-enter `playing`.
- On final card: mount `<FinalCard>` instead of `<RevealCard>`; exit becomes available.

---

## 37. Demo Stability Strategy

The demo is its own engineering surface. Treated as a product feature, not an afterthought.

**Pre-demo checklist (T-12h to T-0):**

- [ ] Cloud Run min-instances raised to 1.
- [ ] Latest deploy smoke-tested with the canonical demo input.
- [ ] Fallback path verified by forcing a service-level error in a preview environment.
- [ ] Demo bypass URL (with `?demo=1`) verified to render the cached reveal.
- [ ] Fonts cached on the demo device (one cold load before the demo).
- [ ] Phone in airplane mode → demo bypass URL → reveal renders. Confirmed.
- [ ] Phone on demo network → live run with canonical input. Confirmed.
- [ ] Backup phone set up identically.
- [ ] Tether available as backup network.

**During demo:**
- Always start the demo from the `?demo=1` URL or from the canonical input.
- Never type into the upload affordance live — paste from clipboard.
- If anything visibly wrong: silently switch to backup phone, no acknowledgment.

The demo is a performance. Engineering is the rehearsal.

---

## 38. Production Risk Analysis

Top risks, ranked, with mitigations:

| Rank | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| 1 | Generic / therapy-toned output | High | Critical | Voice contract + filter + exemplars + repair retry |
| 2 | Demo network failure | Medium | Critical | Demo bypass URL + cached fallback + tether backup |
| 3 | Gemini cold latency | Medium | High | Min-instances=1; pre-warm 1h before demo |
| 4 | Hallucinated specifics | Medium | High | Specificity validator (§33 check 6) |
| 5 | Mobile motion jank | Medium | Medium | Motion budget + reduced-motion path |
| 6 | Schema drift on model update | Low | High | Pinned model versions; smoke test on deploy |
| 7 | Gemini quota exhaustion mid-demo | Low | Critical | Pre-baked fallback + traffic cap before demo |
| 8 | GCS signed URL expiry edge case | Low | Medium | 5-min expiry, surfaced as a benign retry on client |

Each row above corresponds to a concrete artifact in the codebase. No risk is acknowledged without a mechanism.

---

## 39. Recommended Folder Structure

```
sinyal/
├── apps/
│   └── web/                        # Next.js 15 app
│       ├── app/
│       │   ├── (entry)/page.tsx
│       │   ├── reveal/page.tsx
│       │   ├── share/[id]/page.tsx
│       │   └── api/
│       │       ├── upload-urls/route.ts   # proxies to Cloud Run, or local handler
│       │       └── reveal/route.ts        # proxies to Cloud Run
│       ├── components/
│       │   ├── cinema/
│       │   ├── upload/
│       │   ├── voice/
│       │   └── reveal/
│       ├── lib/
│       │   ├── inference/
│       │   ├── validators/
│       │   ├── pacing/
│       │   ├── motion/
│       │   ├── haptics/
│       │   └── types/
│       ├── public/
│       │   └── fallback/
│       │       └── reveal.json
│       ├── state/
│       └── styles/
├── services/
│   └── api/                        # Cloud Run service
│       ├── src/
│       │   ├── index.ts
│       │   ├── routes/
│       │   │   ├── upload-urls.ts
│       │   │   └── reveal.ts
│       │   ├── inference/
│       │   │   ├── runRevealInference.ts
│       │   │   ├── compose.ts
│       │   │   └── selectModel.ts
│       │   ├── validators/
│       │   │   ├── schema.ts
│       │   │   └── voice.ts
│       │   ├── storage/
│       │   │   └── gcs.ts
│       │   └── prompts/            # mirrors top-level prompts/
│       ├── Dockerfile
│       └── package.json
├── prompts/
│   ├── voice_contract.md
│   ├── scaffold.md
│   ├── forbidden_words.json
│   └── exemplars/
│       ├── 01_late_night_loop.md
│       ├── 02_avoidance_pattern.md
│       └── 03_identity_fatigue.md
├── docs/
│   ├── PRD.md
│   └── SDD.md
├── infra/
│   └── (cloud run yaml, gcs lifecycle config)
├── .github/
│   └── workflows/
│       ├── deploy-web.yml
│       └── deploy-api.yml
├── pnpm-workspace.yaml
├── package.json
└── README.md
```

The web app and API service can also be collapsed into a single Next.js project if monorepo overhead feels heavy for the hackathon timebox. Both layouts are supported by the design.

---

## 40. Google AI Studio Build Strategy

The build flow is engineered around Google AI Studio as the prompt development surface and Cloud Run as the runtime.

**Phase 1 — Voice and exemplars in AI Studio (no code).**
- Open Gemini 2.5 Flash and Pro in Google AI Studio.
- Iterate on the voice contract directly in the system instruction field.
- Build the three exemplars by uploading test screenshot batches and shaping outputs by hand.
- Lock the voice contract and exemplars when three back-to-back runs produce reveals that meet the Wow criteria.

**Phase 2 — Export to code.**
- Copy the locked system instruction → `prompts/voice_contract.md`.
- Copy the locked exemplars → `prompts/exemplars/`.
- Copy the structured response schema → `lib/validators/schema.ts`.
- Wire `services/api` to call Gemini with these constants.

**Phase 3 — Client cinema.**
- Build the entry surface and the reveal surface against a mocked `RevealPayload` (the locked exemplars serve as fixtures).
- Tune motion, type, and pacing in isolation from the model.

**Phase 4 — Integration.**
- Connect client to service.
- Run end-to-end with real uploads.
- Iterate on the validator until the repair retry rate is below 10% on the test set.

**Phase 5 — Demo hardening.**
- Implement the fallback path.
- Pre-bake the canonical demo input + cached payload.
- Add the `?demo=1` bypass.
- Run the pre-demo checklist (§37).

This phased flow uses AI Studio for what it is best at (prompt iteration) and code for what it is best at (cinematic UI + boundaries). It also allows the design and prompt work to happen in parallel — critical given a single-developer timebox.

---

*End of SDD.*
