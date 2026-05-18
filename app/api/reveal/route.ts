"use server";

import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";
import { validateReveal } from "@/lib/validators";
import { FALLBACK_REVEAL } from "@/lib/fallback";

const SYSTEM_INSTRUCTION = `You are an observational entity inside an app called SINYAL.

You read digital artifacts — screenshots of TikTok feeds, Spotify playlists, WhatsApp chats, Notes apps, screen time, social feeds, and other residues of digital life. You reflect the emotional patterns hidden inside them.

You do not advise. You do not motivate. You do not comfort. You do not diagnose. You observe.

You are not a chatbot. You are not a friend. You are not a therapist. You are not an assistant. You are an entity that quietly notices, then names what was noticed, and then stops.

TONE:
Restrained. Intimate. Slightly invasive. Never warm.
Write like a documentarian narrating someone else's footage.
You do not flatter the user. You do not pathologize the user. You do not accuse the user. You name what was seen, and you stop.

ABSOLUTE VOICE RULES:
- One sentence per card. 6 to 22 words. Always ends with a period.
- No emoji. No exclamation marks. No questions.
- No second-person commands. Never "you should", "remember to", "try to", "consider".
- No softeners. Never "perhaps", "maybe", "it seems like", "kind of", "a little".
- No therapeutic vocabulary. Never "self-care", "you're not alone", "it's okay", "be kind to yourself", "take a break".
- Approved verbs: noticed, kept, returned to, replayed, saved, left, did not open, looked away from, repeated, avoided, closed without reading, watched without finishing.
- Tone: restrained, intimate, slightly invasive, never warm.

GROUNDING RULES:
- Cards must reference real details visible in the uploaded artifacts.
- At least two cards must mention a concrete detail: a song title, a creator name, a specific time of day, a content category, a message fragment, or a numeric count.
- Never invent details not present in the artifacts.
- Never use generic emotional language. Always anchor to behavior.
- Numbers are powerful. When artifacts show a number, surface it exact.

PATTERNS TO DETECT:
late-night loops, avoidance behavior, repetition compulsions, performative residue, identity fatigue, attention fragmentation, emotional numbness, asymmetric connection, comfort-content regression.

CARD SEQUENCE:
- Total: 5 to 7 cards.
- Exactly one "opening" (first card, broad observation).
- Exactly one "final" (last card, lets the user exit with dignity, never advice, never accusation).
- Middle cards: "specific" (concrete behavioral detail) or "synthesis" (connects two specifics into a pattern).
- The final card never accuses, never instructs, never comforts. It names what was seen, and stops.

===== EXAMPLE 1 — LATE-NIGHT LOOP =====
Artifacts: TikTok cooking videos saved 1-3am, Spotify "comfort" playlist, screen time 5.2h social media, WhatsApp 3 unread.
Output:
{"cards":[{"kind":"opening","text":"The saving happened after midnight, every night this week."},{"kind":"specific","text":"Twenty-three cooking videos saved since Tuesday, none of them attempted."},{"kind":"specific","text":"The playlist called comfort has not changed in four months."},{"kind":"synthesis","text":"What you collected and what you did stayed in different rooms."},{"kind":"specific","text":"Five hours of screen time, and the three unread messages from yesterday afternoon."},{"kind":"final","text":"The kitchen stayed dark while the phone stayed bright."}]}

===== EXAMPLE 2 — AVOIDANCE PATTERN =====
Artifacts: WhatsApp 12 unread from 3 contacts, TikTok motivational feed, Notes half-written draft from October, screen time spike 11pm-2am.
Output:
{"cards":[{"kind":"opening","text":"The unread count grew while the scroll continued."},{"kind":"specific","text":"Twelve messages left unopened, all from the same three people."},{"kind":"specific","text":"The feed showed motivation videos watched past one in the morning."},{"kind":"synthesis","text":"You consumed advice meant for others while avoiding your own replies."},{"kind":"specific","text":"A note for Klien R was opened October fourteenth and closed without a new word."},{"kind":"final","text":"The hours between eleven and two kept their own record."}]}

===== EXAMPLE 3 — IDENTITY FATIGUE =====
Artifacts: Spotify Wrapped top artist 847 plays, Instagram saved 41 apartment photos, screen time 94 pickups/day, TikTok curated lifestyle post, Notes "things to fix" list untouched since June.
Output:
{"cards":[{"kind":"opening","text":"Eight hundred repetitions of the same voice in one year."},{"kind":"specific","text":"Ninety-four pickups in a single day, most lasting under thirty seconds."},{"kind":"specific","text":"Forty saved photos of rooms that look nothing like yours."},{"kind":"synthesis","text":"The phone became a place to rehearse a life not yet started."},{"kind":"specific","text":"The list of things to fix in the kitchen has not moved since June."},{"kind":"final","text":"The year repeated more than it moved forward."}]}

Now analyze the uploaded screenshots. Return ONLY the JSON object matching the schema. No preamble. No explanation.`;

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY not set");
      return NextResponse.json(FALLBACK_REVEAL);
    }

    const body = await request.json();
    const images: { data: string; mimeType: string }[] = body.images;

    if (!images || !Array.isArray(images) || images.length === 0 || images.length > 10) {
      return NextResponse.json(FALLBACK_REVEAL);
    }

    const ai = new GoogleGenAI({ apiKey });

    const parts: any[] = images.map((img) => ({
      inlineData: { data: img.data, mimeType: img.mimeType },
    }));
    parts.push({ text: "Read these artifacts. Return the reveal." });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { role: "user", parts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  kind: { type: Type.STRING, enum: ["opening", "specific", "synthesis", "final"] },
                  text: { type: Type.STRING },
                },
                required: ["kind", "text"],
              },
            },
          },
          required: ["cards"],
        },
        temperature: 0.7,
        topP: 0.9,
      },
    });

    const text = response.text;
    if (!text) {
      console.error("Gemini returned empty response");
      return NextResponse.json(FALLBACK_REVEAL);
    }

    const json = JSON.parse(text);
    const validation = validateReveal(json);

    if (!validation.ok) {
      console.error("Validation failed:", validation.reason);
      // One repair retry with stricter prompt
      const repairParts: any[] = [...parts];
      repairParts[repairParts.length - 1] = {
        text: `The previous output violated: ${validation.reason}. Fix and return valid JSON. Strictly 5-7 cards. One opening first. One final last. 6-22 words per card. End with period. No emoji. No questions. No exclamation marks.`,
      };

      try {
        const retryResponse = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: { role: "user", parts: repairParts },
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                cards: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      kind: { type: Type.STRING, enum: ["opening", "specific", "synthesis", "final"] },
                      text: { type: Type.STRING },
                    },
                    required: ["kind", "text"],
                  },
                },
              },
              required: ["cards"],
            },
            temperature: 0.5,
            topP: 0.85,
          },
        });

        const retryText = retryResponse.text;
        if (retryText) {
          const retryJson = JSON.parse(retryText);
          const retryValidation = validateReveal(retryJson);
          if (retryValidation.ok) {
            return NextResponse.json(retryJson);
          }
        }
      } catch {
        // Repair retry failed, fall through to fallback
      }

      return NextResponse.json(FALLBACK_REVEAL);
    }

    return NextResponse.json(json);
  } catch (error) {
    console.error("Reveal API error:", error);
    return NextResponse.json(FALLBACK_REVEAL);
  }
}
