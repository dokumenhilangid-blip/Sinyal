"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  EASING_QUIET,
  DUR_SLOW,
  DUR_BASE,
  DUR_BREATH,
  DUR_DWELL,
  LOADER_MIN_MS,
  BLACK_GAP_MS,
  FINAL_AFFORDANCE_DELAY_MS,
  LOADER_PHRASE_INTERVAL_MS,
} from "@/lib/motion-tokens";

// === TYPES ===
interface RevealCard {
  kind: string;
  text: string;
}

// === CONSTANTS ===
const LOADER_PHRASES = [
  "reading what you didn't say.",
  "looking at the hours you left uncounted.",
  "reading between the saves and the skips.",
  "holding still.",
  "watching the pattern surface.",
];

// === MAIN COMPONENT ===
export default function SinyalApp() {
  const [view, setView] = useState<"landing" | "loading" | "reveal">("landing");
  const [files, setFiles] = useState<File[]>([]);
  const [cards, setCards] = useState<RevealCard[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files).filter((f) => f.type.startsWith("image/"));
      setFiles((prev) => [...prev, ...selected].slice(0, 10));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    if (dropped.length > 0) setFiles((prev) => [...prev, ...dropped].slice(0, 10));
  };

  // Paste support
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (view !== "landing") return;
      if (e.clipboardData?.files) {
        const pasted = Array.from(e.clipboardData.files).filter((f) => f.type.startsWith("image/"));
        if (pasted.length > 0) setFiles((prev) => [...prev, ...pasted].slice(0, 10));
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [view]);

  // Compress and submit
  const startAnalysis = useCallback(async () => {
    if (files.length === 0) return;
    setView("loading");

    const startTime = Date.now();

    const compress = (file: File): Promise<{ data: string; mimeType: string }> =>
      new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
          URL.revokeObjectURL(url);
          const canvas = document.createElement("canvas");
          const MAX = 1200;
          let w = img.width;
          let h = img.height;
          if (w > h) {
            if (w > MAX) { h *= MAX / w; w = MAX; }
          } else {
            if (h > MAX) { w *= MAX / h; h = MAX; }
          }
          canvas.width = Math.floor(w);
          canvas.height = Math.floor(h);
          const ctx = canvas.getContext("2d");
          if (!ctx) return reject(new Error("no canvas ctx"));
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
          resolve({ data: dataUrl.split(",")[1], mimeType: "image/jpeg" });
        };
        img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("img load failed")); };
        img.src = url;
      });

    try {
      const images = await Promise.all(files.map(compress));

      const res = await fetch("/api/reveal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images }),
      });

      const data = await res.json();

      // VDS §17.3 — hold loader minimum 12 seconds
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, LOADER_MIN_MS - elapsed);
      if (remaining > 0) await new Promise((r) => setTimeout(r, remaining));

      setCards(data.cards || []);
      setView("reveal");
    } catch {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, LOADER_MIN_MS - elapsed);
      if (remaining > 0) await new Promise((r) => setTimeout(r, remaining));

      // Fallback loaded client-side
      const { FALLBACK_REVEAL } = await import("@/lib/fallback");
      setCards(FALLBACK_REVEAL.cards);
      setView("reveal");
    }
  }, [files]);

  return (
    <main className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      <AnimatePresence mode="wait">
        {view === "landing" && <LandingView key="land" files={files} fileInputRef={fileInputRef} onFileChange={handleFileChange} onDrop={handleDrop} onContinue={startAnalysis} />}
        {view === "loading" && <LoaderView key="load" />}
        {view === "reveal" && <RevealView key="rev" cards={cards} onReset={() => { setView("landing"); setFiles([]); setCards([]); }} />}
      </AnimatePresence>
    </main>
  );
}

// === LANDING ===
function LandingView({
  files, fileInputRef, onFileChange, onDrop, onContinue,
}: {
  files: File[];
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onContinue: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: DUR_SLOW, ease: EASING_QUIET }}
      className="w-full max-w-[36rem] px-6 flex flex-col items-center justify-center text-center relative min-h-screen"
    >
      {/* Headline — VDS §4.1, §11 */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DUR_BREATH, ease: EASING_QUIET, delay: 0.2 }}
        className="text-lg opacity-70 mb-16 font-serif"
      >
        Show what you've been looking at.
      </motion.p>

      {/* Upload zone — VDS §8.1, §12 */}
      <div
        className="w-full border border-dashed border-[var(--color-hairline)] p-12 cursor-pointer transition-colors duration-300 hover:border-[var(--color-mono-dim)]"
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={onFileChange}
        />
        <span className="font-mono text-xs tracking-widest text-[var(--color-mono-dim)]">
          {files.length > 0 ? `${files.length} artifacts selected` : "drop screenshots"}
        </span>
      </div>

      {/* Continue affordance — VDS §3 refusal of filled buttons */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: DUR_SLOW, ease: EASING_QUIET }}
            onClick={onContinue}
            className="mt-12 font-mono text-xs tracking-widest text-[var(--color-mono)] border-b border-[var(--color-mono)]/30 pb-1 opacity-60 hover:opacity-100 transition-opacity duration-300"
          >
            continue
          </motion.button>
        )}
      </AnimatePresence>

      {/* Footer — VDS §8.5 privacy line + §13.3 voice signature */}
      <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-2">
        <span className="font-mono text-[10px] tracking-widest text-[var(--color-mono-dim)] opacity-30">
          the screenshots are read once and forgotten.
        </span>
        <span className="font-mono text-[10px] tracking-widest text-[var(--color-mono-dim)] opacity-25">
          sinyal · the entity reads, then forgets.
        </span>
      </div>
    </motion.div>
  );
}

// === LOADER ===
function LoaderView() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % LOADER_PHRASES.length);
    }, LOADER_PHRASE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: DUR_SLOW, ease: EASING_QUIET }}
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
    >
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: DUR_SLOW, ease: EASING_QUIET }}
          className="font-mono text-xs tracking-widest text-[var(--color-mono-dim)]"
        >
          {LOADER_PHRASES[index]}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
}

// === REVEAL ===
function RevealView({ cards, onReset }: { cards: RevealCard[]; onReset: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [canAdvance, setCanAdvance] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [finalAffordanceVisible, setFinalAffordanceVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const isFinal = currentIndex === cards.length - 1;
  const currentCard = cards[currentIndex];

  // Dwell timer — VDS §6.1
  useEffect(() => {
    setCanAdvance(false);
    const dwell = isFinal ? DUR_DWELL * 1000 : DUR_DWELL * 1000;
    const timer = setTimeout(() => setCanAdvance(true), dwell);
    return () => clearTimeout(timer);
  }, [currentIndex, isFinal]);

  // Final affordance delay — VDS §17.4
  useEffect(() => {
    if (!isFinal) { setFinalAffordanceVisible(false); return; }
    const timer = setTimeout(() => setFinalAffordanceVisible(true), FINAL_AFFORDANCE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [isFinal, currentIndex]);

  // Advance with black gap — VDS §6.5
  const handleAdvance = () => {
    if (!canAdvance || isFinal) return;
    setCanAdvance(false);
    setTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setTransitioning(false);
    }, BLACK_GAP_MS);
  };

  // Share — VDS §9.2 (accent on share)
  const handleShare = async () => {
    const text = cards.map((c) => c.text).join("\n\n");
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: "SINYAL", text });
        return;
      } catch { /* user cancelled or unsupported */ }
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* clipboard failed */ }
  };

  // VDS §7.1 — position bias per card kind
  const getOffset = (kind: string) => {
    switch (kind) {
      case "opening": return "-translate-y-[6vh]";
      case "final": return "-translate-y-[8vh]";
      default: return "-translate-y-[4vh]";
    }
  };

  // VDS §7.1 — opening is smaller
  const getSize = (kind: string) => {
    return kind === "opening"
      ? "text-xl sm:text-3xl md:text-4xl"
      : "text-2xl sm:text-4xl md:text-5xl";
  };

  if (!cards || cards.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: DUR_SLOW, ease: EASING_QUIET }}
      className="absolute inset-0 w-full h-full flex flex-col"
    >
      {/* Card area */}
      <div className="flex-1 w-full flex flex-col items-center justify-center p-8 sm:p-16">
        {/* Synthesis hairline — VDS §7.1, §9.2 */}
        {!transitioning && currentCard?.kind === "synthesis" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: DUR_SLOW }}
            className="w-20 h-px mb-8"
            style={{ backgroundColor: "var(--color-accent)" }}
          />
        )}

        {/* The card */}
        {!transitioning && (
          <AnimatePresence mode="wait">
            <motion.h1
              key={currentIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: DUR_SLOW, ease: EASING_QUIET }}
              className={`${getSize(currentCard.kind)} ${getOffset(currentCard.kind)} leading-tight text-center max-w-3xl select-none cursor-default font-serif`}
            >
              {currentCard.text}
            </motion.h1>
          </AnimatePresence>
        )}
      </div>

      {/* Advance affordance — VDS §12 Rule 1: tap only on explicit affordance */}
      {!isFinal && (
        <div className="absolute bottom-0 left-0 w-full h-[80px] flex justify-center items-center">
          <button
            onClick={handleAdvance}
            disabled={!canAdvance}
            className={`font-mono text-xs tracking-widest border-b border-[var(--color-mono)]/30 pb-1 transition-opacity duration-300 ${
              canAdvance ? "opacity-60 hover:opacity-100 cursor-pointer" : "opacity-20 cursor-default"
            }`}
          >
            continue
          </button>
        </div>
      )}

      {/* Final card affordances — VDS §9.2, §17.4 */}
      {isFinal && finalAffordanceVisible && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DUR_SLOW, ease: EASING_QUIET }}
          className="absolute bottom-0 left-0 w-full h-[80px] flex items-center justify-center gap-6"
        >
          <button
            onClick={onReset}
            className="font-mono text-xs tracking-widest text-[var(--color-mono-dim)] opacity-60 hover:opacity-100 transition-opacity duration-300"
          >
            close
          </button>
          <button
            onClick={handleShare}
            className="font-mono text-xs tracking-widest opacity-60 hover:opacity-100 transition-opacity duration-300 border-b pb-1"
            style={{ borderColor: "var(--color-accent)" }}
          >
            {copied ? "copied" : "share"}
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
