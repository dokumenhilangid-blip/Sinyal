# SINYAL — Visual Direction System (VDS)

> The complete visual, motion, and interaction language for a cinematic AI-native behavioral mirror.

**Document Version:** 1.0
**Status:** Source of Truth — Pre-Implementation
**Audience:** Designers, frontend engineers, AI coding agents, demo hardeners
**Companion documents:** [PRD.md](./PRD.md), [SDD.md](./SDD.md)
**Reading order:** PRD (why) → VDS (how it feels) → SDD (how it's built)

This document is not a brand guideline. It is the visual contract of the entity. Every rule here exists to protect a single emotional outcome: the moment a user looks at the screen and stops moving.

---

## 1. Core Visual Philosophy

SINYAL is a piece of cinema that happens to be interactive. It is not an app that uses cinematic effects.

The visual philosophy rests on five commitments:

**1. The screen is a chamber, not a surface.**
Most apps treat the screen as a surface for placing controls. SINYAL treats it as a chamber the user has entered. Controls are not arranged on it; they appear inside it, sparingly, when needed, and dissolve when not.

**2. Absence is composition.**
The empty parts of the screen are doing as much work as the filled parts. Negative space is not waste; it is breath. A SINYAL screen with one sentence and a black void is more composed than a dashboard with twelve elements.

**3. Type is the protagonist.**
There are no illustrations, no icons, no decorative graphics. Typography carries the entire emotional load. The product is built on the assumption that one well-chosen sentence in well-chosen type beats any visual embellishment.

**4. Restraint signals intelligence.**
Every additional UI element reduces perceived intelligence. A system that needs five buttons looks unsure. A system that needs one looks decisive. SINYAL chooses one.

**5. The system is observed, not used.**
The user does not "use" SINYAL the way they use Notion or Spotify. They submit to it. The interface design must produce that asymmetry — the user feels watched, not served.

These five commitments are non-negotiable. Every visual decision in this document derives from them.

---

## 2. Emotional Experience Goals

Five emotional states, in sequence, mapped to interface phases:

| Phase | Target Emotion | Failure Emotion (avoid) |
|---|---|---|
| Approach | Quiet curiosity, mild unease | Marketed-to, welcomed, onboarded |
| Surrender | Hesitation, low vulnerability | Friction, judgment, fear of mistake |
| Processing | Anticipation, slight dread | Boredom, technical loading anxiety |
| Reveal | Recognition, disarmed silence | Validation, self-help, advice fatigue |
| Aftermath | Reflective stillness, sometimes grief | Dopamine spike, share-loop urgency |

The interface is a tuning fork for these states. If the user feels "I am being helped" at any point, the visual system has failed. If the user feels "I have been read," the visual system has succeeded.

The chamber is colder than the user expects. The voice is more specific than they prepared for. The pace is slower than they instinct toward. These three frictions, held together, produce the emotional outcome.

---

## 3. UI Identity Principles

The identity of the SINYAL interface is established by what it refuses to do.

**Refusals (identity locks):**

- Refuses to greet.
- Refuses to use bright colors.
- Refuses to use rounded full-radius buttons.
- Refuses to use gradients.
- Refuses to use drop shadows.
- Refuses to use icons in the reveal flow.
- Refuses to use illustrations or 3D objects.
- Refuses to use modal dialogs.
- Refuses to use toast notifications.
- Refuses to use loading spinners.
- Refuses to use progress bars.
- Refuses to use confetti, celebration, or success states.
- Refuses to use emoji anywhere in the UI.
- Refuses to use placeholder gray.
- Refuses to use the color blue.

**Affirmations (identity carriers):**

- A near-black canvas that never changes hue across screens.
- One serif display face for the entity's voice.
- One mono face for system marks, lowercase, tracked wide.
- A single accent color, used twice in the entire experience.
- Hairline borders, never solid blocks.
- Type that fades and rises; type that does not slide or bounce.
- Long beats of stillness between transitions.

The identity is enforced negatively. The list of refusals is longer than the list of affirmations on purpose.

---

## 4. Typography System

Typography is the highest-priority element in the system. Two faces only.

### 4.1 Display face — Fraunces (or Source Serif 4 as alternate)

- **Used for:** all reveal cards, the entry headline, the final card.
- **Weight:** 400 (Regular). Never bold. Never light.
- **Optical size:** soft (40–72 opsz preferred).
- **Tracking:** 0 to -0.01em. Never positive.
- **Leading:** 1.05–1.15. Tight.
- **Sizes (clamped, mobile-first):**
  - Reveal card: `clamp(28px, 6.5vw, 56px)`
  - Entry headline: `clamp(18px, 4.5vw, 24px)`
  - Final card: same as reveal card; positioned higher in viewport.
- **Hyphenation:** off.
- **Word-break:** off. Allow overflow rather than break a phrase.
- **Smart quotes:** on. Em dashes preferred over double-hyphens.

The display face speaks. It must look like it considered each sentence.

### 4.2 Mono face — JetBrains Mono

- **Used for:** system voice marks, loader phrases, advance affordance ("continue"), share/close labels, all uppercase / lowercase tagged metadata.
- **Weight:** 400 only.
- **Tracking:** 0.18em–0.22em (wide).
- **Case:** lowercase by default. Uppercase only for the loader marker before the diegetic phrase.
- **Size:** 12–14px. Never larger than 16px.
- **Opacity:** 0.5 default, 1.0 only on active interactive states.

The mono face is the breath of the system. It exists to remind the user that something computational is observing — not a human writer, not a brand voice.

### 4.3 Pairing rules

- Display and mono are never used in the same line.
- Display sets the message; mono sets the meta.
- A reveal card uses display only. A loader uses mono only. The advance affordance uses mono only. The headline on entry uses display only.
- No third typeface, ever. Sans-serif is forbidden across the entire product.

### 4.4 Font loading

- Display face: `font-display: block` for the entry surface and reveal surface. Accept FOIT to avoid swap flicker on the first card.
- Mono face: `font-display: swap` is acceptable.
- Both faces self-hosted. No runtime Google Fonts call.
- Subset: Latin + Latin-extended only. No icon ligatures.

---

## 5. Layout and Spacing Rules

### 5.1 The grid is invisible

There is no visible grid, no columns, no gutters. Layout is composed by intention, not by system.

### 5.2 Containers

- **Maximum content width:** 36rem (576px). Wider than this and the type loses intimacy.
- **Mobile gutter:** 24px on each side.
- **Tablet+ gutter:** 48px on each side.
- **Vertical centering:** the reveal card is vertically centered with a slight upward bias (~ -4vh from true center) — type sits where the eye expects to read, not where the geometry expects to draw.

### 5.3 Spacing scale

A 4px base scale, used sparingly:

```
4   8   12   16   24   32   48   64   96   128
```

Most of the product uses two values: `64px` (between major elements) and `24px` (between related elements). The smaller values exist for the rare moments when a hairline border or a mono mark sits next to display type.

### 5.4 Composition rules

- Every screen has **exactly one focal element**.
- The focal element is positioned at optical center, not geometric center.
- Auxiliary elements (advance affordance, system voice mark, share row) live at the edges, never adjacent to the focal element.
- The advance affordance is anchored to the bottom of the viewport, in an 80px-tall band, full-width, centered horizontally.
- The system voice mark (e.g., a date range or signal label) sits 32px above the reveal card, centered, mono, lowercase, opacity 0.4.

### 5.5 Safe areas

- Always respect `env(safe-area-inset-*)` on iOS notched devices.
- The advance affordance band must not overlap the home indicator.
- Type may extend into the upper safe area only on the entry surface (status bar overlay), never on the reveal surface.

---

## 6. Motion and Transition Language

Motion is the single largest threat to the product's identity. A wrong motion choice instantly turns SINYAL into a generic startup app. The motion system is therefore restrictive on purpose.

### 6.1 Duration tokens

```
fast:    200ms     // micro-state changes (affordance hover, active states)
base:    400ms     // exit transitions
slow:    600ms     // standard enter transitions, card-to-card
breath:  1200ms    // entry headline rise, environmental fades
dwell:   1500ms    // mandatory hold time before advance becomes active
```

### 6.2 Easing tokens

Two easings only:

```
quiet:  cubic-bezier(0.22, 0.61, 0.36, 1)    // for fades and rises
settle: cubic-bezier(0.16, 1, 0.30, 1)       // for resting motions
```

No springs. No bounces. No back-easing. No elastic. No anticipation.

### 6.3 What the system animates

- Opacity (0 → 1, 1 → 0).
- Translate Y (8px → 0, 0 → -8px). Rises only. Never falls more than 8px.
- That is the entire motion alphabet for the reveal surface.

### 6.4 What the system never animates

- Translate X. There are no slides.
- Scale. Nothing zooms.
- Rotate. Nothing spins.
- Width or height. Nothing reflows.
- Color. Hues never animate.
- Background. The canvas is static.
- 3D transforms. There is no parallax.

### 6.5 Transition rules

- Card-to-card: current card fades out (400ms) and translates -8px; next card fades in (600ms) and translates 0 from +8px. A 200ms gap of pure black sits between them. The gap is the cut.
- Entry headline: 1200ms rise, single occurrence, never replays.
- Loader phrases: 600ms in, 600ms out, 2500ms hold. The phrase is the only thing moving on the screen during processing.
- Surface-to-surface (entry → reveal, reveal → aftermath): 600ms fade through black. No crossfade. The black gap is the transition.

### 6.6 Reduced motion

When `prefers-reduced-motion: reduce` is set:
- All translates are removed.
- All durations are reduced to a quarter of their standard value.
- Dwell times are preserved (they are emotional pacing, not animation).
- The 200ms black gap between cards is preserved.

The product must remain emotionally legible without motion.

---

## 7. Card System Architecture

The reveal card is the atomic unit of the SINYAL experience. Every other element exists to set up the card or recover from it.

### 7.1 Card kinds

Four kinds, defined in the SDD §11. The visual treatment differs subtly:

| Kind | Position bias | Top mark | Notes |
|---|---|---|---|
| `opening` | Slightly higher (-6vh) | none | Smaller display size (~85% of standard). More breath above. |
| `specific` | Center | optional system voice mark above | Default treatment. The workhorse. |
| `synthesis` | Center | thin 80px hairline above | Signals "this connects two things." |
| `final` | Higher (-8vh) | none | Below the card: 32px gap, then exit + share row in mono. |

### 7.2 Anatomy of a card

```
[ optional system voice mark — mono, lowercase, opacity 0.4 ]
[ 32px gap ]
[ THE SENTENCE — display face, vertically anchored ]
[ 32px gap on non-final cards, advance affordance in 80px band ]
```

There is no card border, no card background, no card surface. The "card" is just type on the chamber. The word "card" is a metaphor borrowed from cinema title cards, not from material design.

### 7.3 Card lifecycle states

```
hidden   → entering   → playing   → advancing   → hidden
```

- `hidden`: opacity 0. Not in DOM.
- `entering`: 600ms quiet ease, opacity 0→1, translateY +8→0.
- `playing`: opacity 1, translateY 0. Dwell timer running. After 1500ms, advance affordance enables (its own opacity transition, 400ms).
- `advancing`: 400ms quiet ease, opacity 1→0, translateY 0→-8.
- Then 200ms black gap before next card enters.

### 7.4 What is forbidden on a card

- No background fill.
- No drop shadow.
- No border or stroke around the text.
- No icon adjacent to the text.
- No tooltip.
- No hover effect on the text itself.
- No selection highlight color other than `bg-white/20`.

---

## 8. Screenshot Treatment Rules

The user's uploaded screenshots are the rawest, most personal data the product touches. Their visual treatment is part of the emotional contract.

### 8.1 During upload (entry surface)

- Uploaded items appear as small, dim thumbnails — at most 64×64px.
- Thumbnails are arranged in a single horizontal row, scrolling-allowed if more than 5.
- Thumbnail opacity: 0.4. Hover/active: 0.7.
- No filename labels.
- No file size labels.
- No "remove" X buttons by default. (A long-press to remove is the optional gesture, but not part of MVP.)
- No grid view. The thumbnails are evidence, not content.

### 8.2 During processing (loader)

- Thumbnails are not shown during processing.
- The loader screen is type only. The screenshots are absorbed into the system the moment processing begins.

### 8.3 During reveal

- Screenshots are never displayed on a reveal card.
- The card may reference screenshot details in text ("twenty-three cooking videos saved"), but the image itself is not shown.
- This is a hard rule. The image is in the user's memory; the system does not redisplay it. Showing it back would feel like accusation. Naming it back feels like recognition.

### 8.4 In share assets

- The shareable single-card asset is type-only on a near-black background, with the noise overlay.
- The user's original screenshots never appear in the share asset.

### 8.5 Privacy posture, made visible

- A single sentence on the entry surface: "the screenshots are read once and forgotten." Mono, opacity 0.3, positioned at the bottom of the viewport.
- This sentence is the only privacy copy in the product. There is no privacy modal, no consent checkbox, no cookie banner.

---

## 9. Color and Lighting System

A monochromatic system with one accent. The palette is deliberately small.

### 9.1 Tokens

| Token | Value | Use |
|---|---|---|
| `canvas` | `#0A0A0B` | The chamber. Background of every screen. Never changes. |
| `ink` | `#EDEAE3` | Primary type (display face). Slightly warm off-white. |
| `hairline` | `#26252A` | The 1px lines that mark synthesis cards and section transitions. |
| `mono` | `#8C8A85` | Mono type at full opacity (system voice marks, advance affordance enabled state). |
| `mono-dim` | `#5A5957` | Mono type in dimmed state (advance affordance disabled, privacy line). |
| `accent` | `#C9A24A` | The single accent. A muted brass / aged gold. |
| `grain` | `rgba(255,255,255,0.03)` | The film grain overlay. Mixed via `mix-blend-overlay`. |

### 9.2 Where accent is allowed

Accent (`#C9A24A`) appears in **exactly two places** across the entire product:

1. The underline on the advance affordance, only on the **final card**, only when it has become "share."
2. The hairline above a synthesis card, at 50% opacity (so it reads as a near-hairline but with a faint warmth).

That is the entire allowance. Accent is never used in the entry surface. Never in the loader. Never on opening or specific cards. Never on the close affordance.

The scarcity is the point. The first time the user sees the accent — on the share affordance after the final card — it should feel like the room briefly warmed by half a degree.

### 9.3 Lighting model

There is no lighting effect (no glow, no bloom, no vignette as a discrete element). The lighting is in the typography weight and opacity choices.

- The chamber is black, but not absolute black. `#0A0A0B` lets the grain overlay register.
- The ink is warm, not pure white. This avoids the "screen-glow" sensation of clinical apps.
- The mono is gray-warm, not gray-cool. Cool gray reads as system status; warm gray reads as observation.
- The accent is brass, not gold or yellow. Gold reads as luxury; brass reads as old paper, archive, restraint.

### 9.4 What the palette refuses

- No blue. No green. No red. No purple. No teal.
- No gradients between any two tokens.
- No blur effects (no backdrop-blur, no glassmorphism).
- No translucent panels (no `bg-white/5` panels). Hairlines only.

---

## 10. Texture and Grain Rules

The grain is the only texture in SINYAL. It is what separates the chamber from a blank web page.

### 10.1 The grain layer

- A static SVG noise pattern (no animation).
- Tile size: 240×240px, repeating.
- Generated via `feTurbulence` with `baseFrequency=0.9, numOctaves=2`.
- Served from `/public/noise.svg`. Never from a third-party CDN.
- Applied as a fixed overlay across the entire viewport.
- Opacity: `0.03`. Mix-blend mode: `overlay`.
- Z-index: above all content but `pointer-events: none`.

### 10.2 What the grain does

- It tells the eye that the screen is a surface, not a void. The chamber acquires depth.
- It softens the edges of typography. Sharp digital type on pure black looks sterile; on grain it looks printed.
- It creates a subliminal "this is photographed" sensation, supporting the cinematic identity.

### 10.3 What the grain does not do

- It does not animate. Animated grain looks like noise filter on a webcam — it cheapens the chamber.
- It does not change opacity across screens. The grain is a constant.
- It does not change color. Pure luminance noise only.
- It is not present in the share asset's exported image at the same opacity. The share asset uses 0.06 grain to compensate for compression.

### 10.4 No additional textures

No paper textures. No film burn. No CRT scanlines. No VHS distortion. No glitch. No data-mosh. The grain is the texture vocabulary.

---

## 11. Mobile-first Screen Composition

SINYAL is composed for the phone first. Every visual rule above is verified at 360px viewport width before it is verified anywhere else.

### 11.1 The phone is the cinema

The phone, held vertically, is treated as a small portrait theater. The user holds the screen close enough that:
- A 28px display character feels like 56px in a desktop context.
- A subtle 8px translate feels like a meaningful movement.
- A 1500ms dwell feels like a real pause.

Designing for the phone means trusting that small visual moves carry weight.

### 11.2 Composition zones (vertical phone)

```
[ status bar — system, untouched ]
[ upper safe area / breath — 12% of viewport ]
[ optional system voice mark — mono, opacity 0.4 ]
[ THE FOCAL ELEMENT — type, optical center, slight upward bias ]
[ breath — variable ]
[ advance affordance band — 80px, anchored to bottom safe area ]
[ home indicator safe area ]
```

### 11.3 Ergonomics

- The advance affordance is reachable with the thumb of either hand in standard grip.
- The advance affordance is not a tiny dot; it is an 80px-tall band, full-width, with a small visual marker (the "continue" mono label and a 1px underline) at its center.
- No critical control sits in the upper third of the viewport. The thumb does not travel there during a reveal.

### 11.4 Tablet and desktop

- Tablet: same composition, with increased breath. Display type may grow slightly via the clamp.
- Desktop: the experience letterboxes. The chamber width remains at 36rem, centered. The rest of the viewport stays as canvas. Windows are not the cinema; phones are.

### 11.5 Orientation

- Portrait only is preferred.
- Landscape is permitted but not optimized. If the device rotates, the composition adapts (vertical centering still applies); no special landscape layout is built.

---

## 12. Interaction Silence Rules

Most interface design is an interaction surplus problem. SINYAL practices interaction austerity. Five rules:

**Rule 1 — Tap, not swipe.**
Swipes are casual. Taps are deliberate. The reveal advances by tap on the advance affordance only. Never by swipe. Never by tap-anywhere.

**Rule 2 — Forward only.**
There is no back button in the reveal flow. The user cannot un-see a card. This is the core asymmetry of the product.

**Rule 3 — No skip.**
There is no fast-forward. No "skip intro." No "view summary." The user can exit, not accelerate.

**Rule 4 — One affordance per screen.**
Each screen has exactly one primary affordance. Entry: upload zone. Loader: none (the user waits). Reveal mid-cards: continue. Final card: close + share (the one place where two affordances coexist).

**Rule 5 — Nothing is accidentally clickable.**
Type is `select-none cursor-default`. The chamber background is non-interactive. The grain layer is `pointer-events: none`. The only interactive elements are explicit affordances.

The cumulative effect: the user cannot fidget with the interface. There is nothing to play with. They are forced into the pace the system sets.

---

## 13. AI Voice Tone System

The visual system carries the voice. Type choices, pacing choices, and color choices all reinforce the entity persona defined in PRD §20. This section translates that persona into visual specifications.

### 13.1 Visual signals of voice

- **Restraint** is signaled by white space, not by adjectives.
- **Specificity** is signaled by long-hold dwell times. The system trusts its own sentences enough to leave them on screen.
- **Slight invasiveness** is signaled by the user's inability to escape, fast-forward, or revise.
- **Non-warmth** is signaled by warm-but-not-bright color choices: warm ink, warm mono, brass accent. Warm in temperature, cold in emotion.
- **Observational distance** is signaled by the lowercase mono marks (system voice) sitting away from the display type, never adjacent. The system voice never crowds the entity's voice.

### 13.2 Forbidden voice-visual pairings

- Bright color + tentative copy = "wellness app." Forbidden.
- Centered button + helpful copy = "SaaS dashboard." Forbidden.
- Emoji + any copy = identity death. Forbidden.
- Animated word-by-word reveal = "AI typing effect." Forbidden. Cards appear at once.
- Avatar circle + system voice = "chatbot." Forbidden. There is no avatar.

### 13.3 The voice signature

A small mono mark may appear at the very bottom of the entry surface, opacity 0.25, lowercase: `sinyal · the entity reads, then forgets.`

This is the only place the entity self-references in the UI. It appears once, on entry, never again.

---

## 14. Forbidden UI Patterns

A complete enumeration of patterns the product will never use, organized by category.

### 14.1 Layout patterns forbidden

- Cards with raised surface and shadow.
- Tabbed navigation.
- Bottom navigation bars.
- Side drawers.
- Hero sections with centered buttons.
- Two-column layouts.
- Footers with link clusters.
- "Hamburger" menus.
- Sticky headers.

### 14.2 Component patterns forbidden

- Spinners (any kind).
- Progress bars.
- Step indicators ("step 2 of 5").
- Card counters ("3 of 7").
- Toasts and snackbars.
- Modal dialogs.
- Bottom sheets.
- Alert banners.
- Tooltips.
- Onboarding overlays / coachmarks.
- Empty-state illustrations.
- Skeleton loaders.

### 14.3 Color patterns forbidden

- Gradient backgrounds.
- Gradient buttons.
- Glassmorphism / `backdrop-blur`.
- Neon glow.
- Multi-color accents.
- Rainbow gradients on AI-related elements.
- Purple-to-pink "AI" gradients.

### 14.4 Motion patterns forbidden

- Spring physics.
- Bouncing.
- Word-by-word typewriter effect.
- Slide-in carousels.
- Parallax scrolling.
- Lottie animations.
- Confetti.
- Auto-playing video.
- Looping background animations.

### 14.5 Copy patterns forbidden

- Welcome messages.
- "Get started" calls to action.
- Feature lists.
- Tagline + subtagline + button hero stacks.
- Testimonials.
- "As featured in" logo strips.
- Pricing sections.
- Feature comparison tables.
- FAQ accordions.
- Newsletter sign-ups.
- "Made with" footers.

### 14.6 Brand patterns forbidden

- Logo lockup at top of every screen.
- Watermark on share assets that says "made with SINYAL."
- Bot avatar.
- Friendly mascot.
- Color-changing logo.
- Animated logo intro.

If any of these patterns appears in the product at any phase, the visual identity has been broken. The agent or designer must remove it before shipping.

---

## 15. Emotional Reveal Sequence

The reveal sequence is the cinematic spine of SINYAL. Five to seven cards, choreographed.

### 15.1 The arc

```
opening → specific → specific → [Wow card] → synthesis → specific → final
   (1)      (2)        (3)        (4)         (5)         (6)       (7)
```

The Wow card position is not fixed at index 4 — it can be earlier — but the arc shape is constant: broad, narrowing, recognizing, connecting, settling, releasing.

### 15.2 Per-card visual choreography

| Index | Kind | Visual treatment | Dwell minimum |
|---|---|---|---|
| 1 | opening | Smaller display, higher position, no top mark | 1500ms |
| 2–3 | specific | Standard treatment, optional mono mark above | 1500ms |
| 4 (Wow) | specific | Standard, but the mandated specificity makes it land on its own | 2000ms (extended hold) |
| 5 | synthesis | Hairline above (50% accent), centered | 1500ms |
| 6 | specific or synthesis | Standard | 1500ms |
| 7 | final | Higher position, no mark, exit + share row appears below after dwell | 2000ms before affordance |

### 15.3 Pacing arithmetic

A 7-card reveal at 1500ms minimum dwell + 1000ms transition per card sits at roughly 17–18 seconds of mandatory cinema. The user can extend this indefinitely. They cannot shorten it.

### 15.4 The gap is sacred

Between every card, a 200ms gap of pure black with no type and no mark. The gap is the cut. It is not dead time. It is the breath the user needs between sentences that land.

---

## 16. Demo Flow Cinematic Structure

The demo is its own cinematic edit, separate from the product's normal flow. Optimized for a 90-second judge attention window.

### 16.1 Demo edit (90 seconds)

```
[ 0–3s ]    Approach: black canvas, headline rises.
[ 3–10s ]   Surrender: paste five pre-baked screenshots from clipboard.
[ 10–12s ]  Continue tap. Surface fades to black.
[ 12–28s ]  Loader: diegetic phrases rotate. ~16s total.
[ 28–30s ]  Loader fades; first card primes.
[ 30–80s ]  Reveal sequence: 6 cards, ~8s each (1.5s dwell + variable read time).
[ 80–88s ]  Final card. Exit + share appears. Demo presenter does not interact.
[ 88–90s ]  Closing: presenter says one sentence and stops talking.
```

### 16.2 Demo cinematic principles

- **Never narrate during the reveal.** The presenter shuts up between seconds 30 and 80. The product narrates itself.
- **Never interact during the reveal beyond tapping continue.** No commentary, no zooming, no pointing at the screen.
- **The Wow card lives between seconds 50 and 65.** The presenter watches the judges' faces during this window, not the screen.
- **The closing sentence is rehearsed and singular.** Something like: "the model reads, then forgets." Then silence.

### 16.3 Demo failure visual choreography

If anything visibly breaks (wifi, render, etc.), the presenter does not panic-narrate. They calmly tap the demo bypass URL on a backup phone. The demo presents from the new phone within 5 seconds. The audience never hears an apology.

The demo is a film. The presenter is the projectionist, not the narrator.

---

## 17. Psychological Timing and Pacing

Timing is the product's most underestimated element. Every duration is psychologically tuned.

### 17.1 The four time scales of SINYAL

| Time scale | Duration | Purpose |
|---|---|---|
| **Micro** | 200–600ms | Visual transitions. Below the threshold of conscious attention. |
| **Beat** | 1500–2500ms | Card dwells, loader phrases. The user is consciously waiting and consciously absorbing. |
| **Phase** | 8–18s | A loader run, a reveal sequence. The user is inside one psychological phase. |
| **Session** | 90–180s | The full experience from approach to aftermath. |

### 17.2 Why dwell time exists

Dwell time is not a UX restriction; it is a permission slip. By forcing the user to hold their gaze on a sentence for 1500ms, the system grants them permission to actually read it. Without dwell time, the user instinct is to advance immediately and miss the sentence.

The product trusts dwell time more than it trusts the user.

### 17.3 The loader is a psychological holding pattern

The 16-second loader is not waiting for inference. It is waiting for the user to enter the right state of mind for the reveal. If the model returns in 4 seconds, the loader holds for at least 12 more seconds before transitioning. The pace is the product.

### 17.4 The post-final pause

After the final card mounts, the exit + share affordances do not appear for 2000ms. The user should sit with the final sentence before they are offered a way out.

### 17.5 Timing rules summary

```
- Headline rise:                  1200ms
- Card enter:                     600ms
- Card dwell (mandatory):         1500ms
- Card exit:                      400ms
- Black gap between cards:        200ms
- Loader phrase rotation:         2500ms (600ms in, 1300ms hold, 600ms out)
- Loader minimum total:           12000ms (held even if model returns earlier)
- Final card affordance reveal:   2000ms after card mounts
- Share/copy feedback:            1500ms label swap then revert
```

These numbers are not adjustable for engineering convenience. They are the product.

---

## 18. Visual Hierarchy System

A strict three-layer hierarchy governs every screen.

### 18.1 The three layers

**Layer 1 — Focal layer.**
The single primary message of the screen. Display type. Highest contrast (`ink` on `canvas`). Vertically centered with optical bias. There is exactly one focal element per screen.

**Layer 2 — Meta layer.**
System voice marks, mono labels, dim metadata. Mono type. Lower contrast (`mono` or `mono-dim` on `canvas`). Positioned at edges or above/below the focal layer with generous spacing.

**Layer 3 — Affordance layer.**
The advance affordance, exit, share. Mono type, lowercase, with a thin 1px underline. Anchored to bottom safe area. Disabled state is `mono-dim` at opacity 0.2; enabled state is `mono` at opacity 0.6, hover/active at 1.0.

### 18.2 Hierarchy rules

- The focal layer is never crowded by the meta layer. A minimum 32px gap separates them.
- The affordance layer never overlaps the focal layer. They occupy different vertical zones.
- The grain layer (Layer 0, environmental) sits below all three but above the canvas color.

### 18.3 The Z-axis

```
z=0:   canvas color
z=10:  grain overlay (pointer-events none)
z=20:  focal layer
z=30:  meta layer
z=40:  affordance layer
z=50:  reduced-motion override layer (only for accessibility hooks)
```

No z values above 50 are used. No modals. No popovers. No floating elements that would require z=100.

---

## 19. Animation Principles

Animation in SINYAL is not decoration — it is editing. Six principles:

**Principle 1 — Every motion has a reason.**
A motion that does not communicate state change or hierarchy is removed.

**Principle 2 — Motion is always toward stillness.**
Every animation resolves into a stable state. Nothing loops. Nothing oscillates. Nothing pulses.

**Principle 3 — Type rises; it does not slide.**
The vertical 8px rise is the only translate the system uses on type. Horizontal motion is forbidden because horizontal motion implies navigation, and SINYAL does not navigate.

**Principle 4 — The system does not announce itself.**
There is no entrance animation for the chamber. The user does not see SINYAL "appear." When the page loads, the canvas is already there, and only the headline rises into it.

**Principle 5 — Animation respects dwell.**
Even if a motion is technically completed, the system waits for the dwell minimum before considering the user "ready."

**Principle 6 — Reduced-motion is a first-class path.**
Users who request reduced motion get a quarter-duration version of every animation. They never get a "no-animation" path that breaks the pacing. The cinematic experience must be intact under reduced motion.

---

## 20. Frontend Execution Guidelines for AI Coding Agents

This section is written for the AI coding agents that will implement the visual system. It is not a typical engineering style guide; it is a list of constraints designed to prevent the kinds of regressions LLM agents tend to introduce.

### 20.1 Hard constraints (the agent must never violate these)

- **No new typeface.** Only Fraunces and JetBrains Mono are imported. If a third font appears in code, the change is rejected.
- **No emoji in any string the user sees.** Including loader phrases, error messages, share labels, alt text, and meta tags.
- **No bright color.** No `text-blue-*`, `text-green-*`, `text-red-*`, `text-purple-*`. The only colors permitted are the tokens in §9.1.
- **No spinner or progress component.** If the agent imports a spinner library, the change is rejected.
- **No new icons.** No `lucide-react`, `heroicons`, or any icon library used in the reveal flow. The mono labels are the affordance language. (Note: `lucide-react` is currently in package.json from the AI Studio scaffold; it must remain unused or be removed.)
- **No `transition-all`.** Always specify exact properties (`transition-opacity`, `transition-[opacity,transform]`).
- **No `hover:` state on type.** Type is non-interactive in the reveal flow.
- **No `cursor-pointer` on the chamber background.** Only on the affordance layer.
- **No `bg-gradient-*`.** Solid `canvas` only.
- **No `rounded-*` on affordances.** Hairline underlines, not pill buttons.
- **No `shadow-*`.** No drop shadows of any kind.
- **No `backdrop-blur-*`.** No glassmorphism.

### 20.2 Soft constraints (the agent should not violate these)

- Keep components in plain TSX. No CSS-in-JS runtimes beyond Tailwind.
- Keep state local to the smallest component that needs it. Lift only when two siblings genuinely need the same state.
- Keep animation logic in `framer-motion` / `motion` primitives, not custom RAF loops.
- Prefer composition over configuration. A `<RevealCard>` that takes a `kind` prop is preferable to four separate components.
- Do not introduce new dependencies without explicit human approval. Every dependency is a brand surface.

### 20.3 Code-level patterns to enforce

- **Tailwind tokens** are extended in `globals.css` to expose the §9.1 palette as CSS variables: `--canvas`, `--ink`, `--hairline`, `--mono`, `--mono-dim`, `--accent`, `--grain`.
- **Motion tokens** are extended in `lib/motion/tokens.ts` (per SDD §15) and imported by every motion-using component. No inline easing arrays scattered in JSX.
- **Time tokens** are exposed as constants: `DUR_FAST=200`, `DUR_BASE=400`, `DUR_SLOW=600`, `DUR_BREATH=1200`, `DUR_DWELL=1500`.
- **Reduced-motion** is detected once at the top of the app via a custom hook, exposed via context, and consumed by every motion component.
- **The chamber** (canvas + grain) is mounted in the root layout, not in each route. It does not unmount across navigation.

### 20.4 Pre-merge checklist for any visual change

Before any PR that touches visual code is merged, the agent must verify:

- [ ] No emoji introduced (run a regex check against `\p{Extended_Pictographic}`).
- [ ] No new font imports.
- [ ] No `transition-all`.
- [ ] No `hover:` on display-type elements.
- [ ] No `bg-gradient-*` introduced.
- [ ] No `shadow-*` introduced.
- [ ] Reduced-motion path verified manually.
- [ ] Tested at 360px viewport.
- [ ] Tested with `prefers-reduced-motion: reduce` on.
- [ ] Tested with throttled "slow 3G" network on the entry surface.
- [ ] Demo bypass URL verified to render the cached fallback reveal.

### 20.5 Behavioral tone for agents

When an agent is asked to "make it nicer," "add some polish," "make it more modern," or any similar prompt, the agent should refuse the framing and ask which specific phase or element is failing. SINYAL is not a product that benefits from generic polish. Generic polish is the failure mode this entire document was written to prevent.

When an agent is asked to "speed it up," the agent should refuse and reference §17. The pacing is the product.

When an agent is asked to "add a button," the agent should ask which existing affordance is being replaced. There is no additive UI in SINYAL.

---

## Appendix A — Quick Reference Card

For agents and reviewers, a single-screen summary:

```
PALETTE:        canvas #0A0A0B · ink #EDEAE3 · hairline #26252A
                mono #8C8A85 · mono-dim #5A5957 · accent #C9A24A (×2 only)

TYPE:           Fraunces (display) · JetBrains Mono (mono)
                clamp(28px, 6.5vw, 56px) for cards · 12-14px for mono

MOTION:         opacity + translateY(8px) only · 600ms enter · 400ms exit
                ease quiet [0.22, 0.61, 0.36, 1] · no springs ever

DWELL:          1500ms minimum before advance · 200ms black gap between cards

LAYOUT:         max-width 36rem · vertical center -4vh bias
                gutter 24px mobile · 48px tablet+

GRAIN:          /noise.svg at opacity 0.03 · mix-blend-overlay
                pointer-events none · z-50

NEVER:          spinner · gradient · shadow · emoji · sans-serif · blue
                progress bar · modal · toast · tooltip · skip button
                tap-to-advance · swipe · scale animation · loop animation

ALWAYS:         one focal element · one affordance · one cut between cards
                one accent moment · one share opportunity · one final sentence
```

---

## Appendix B — Anti-Patterns Gallery (text-only)

Five common mistakes, named and described, so reviewers can spot them quickly.

**The Wellness Slip.** A pastel color creeps in. A "you're doing great" copy variant slips into the loader. Fix: revert to chamber palette, revert copy to observational mono.

**The Dashboard Drift.** A counter appears ("3 of 7"). A progress bar appears under the loader. Fix: remove. Cards do not count themselves.

**The Chatbot Costume.** A mock avatar appears. The system says "I." Speech bubbles appear. Fix: the system never says "I." There is no avatar. There are no bubbles.

**The Motion Tax.** Spring animations creep in. Cards bounce. Hover effects pulse. Fix: enforce the easing tokens. Strip every spring.

**The Brand Bloat.** A footer appears with social links. A logo appears in the corner. A "made with" mark appears on the share asset. Fix: SINYAL has no logo presence inside the experience. The only mark is the entry footer line.

---

## Appendix C — Document Provenance

This Visual Direction System is paired with:

- [PRD.md](./PRD.md) — Product requirements (why the product exists).
- [SDD.md](./SDD.md) — System design (how the product is built).
- [docs/README.md](./README.md) — Document index and reading order.

If any rule in this VDS conflicts with the PRD, the PRD wins on emotional intent and this document wins on visual specification. If any rule in this VDS conflicts with the SDD, the SDD wins on engineering feasibility and this document wins on perceptual outcome. When in doubt, choose the path that produces the longer pause from the user.

---

*End of VDS.*
