'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { safeGetJSON, safeRemove, safeSetJSON } from '@/lib/storage';

type JournalState = {
  v: 1;
  updatedAt: number;
  text: string;
};

/**
 * Generate today's storage key (UTC-based)
 */
function todayKeyUTC(): string {
  const d = new Date();
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `gharaib_journal_v1_${y}-${m}-${day}`;
}

/**
 * Daily Question Journal
 * Auto-saves to LocalStorage, persists across sessions
 */
export default function QuestionJournal() {
  const storageKey = useMemo(() => todayKeyUTC(), []);
  const initial = useMemo(
    () => safeGetJSON<JournalState>(storageKey, { v: 1, updatedAt: Date.now(), text: '' }),
    [storageKey]
  );

  const [text, setText] = useState(initial.text);
  const [savedAt, setSavedAt] = useState<number>(initial.updatedAt);
  const [copied, setCopied] = useState(false);

  // Auto-save with debounce
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const payload: JournalState = { v: 1, updatedAt: Date.now(), text };
      safeSetJSON(storageKey, payload);
      setSavedAt(payload.updatedAt);
    }, 450); // 450ms debounce

    return () => window.clearTimeout(timer);
  }, [text, storageKey]);

  // Copy to clipboard
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text.trim());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // Silently fail if clipboard API not available
    }
  };

  // Clear journal
  const onClear = () => {
    setText('');
    safeRemove(storageKey);
    setSavedAt(Date.now());
  };

  const savedLabel = new Date(savedAt).toLocaleTimeString(undefined, { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <section className="max-w-3xl rounded-2xl border border-white/10 bg-black/30 p-6 backdrop-blur">
      {/* Header with actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs tracking-[0.28em] text-white/60">سؤال اليوم</p>
          <p className="mt-2 text-base leading-7 text-white/85">
            ما الشيء الذي لو فهمته جيدًا… سيتغيّر تفسيرك لكل شيء بعده؟
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCopy}
            className="rounded-full border border-white/15 bg-white/5 px-3 py-2 text-xs text-white/80 transition hover:bg-white/10 hover:border-white/25 disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={!text.trim()}
            aria-label="Copy journal text"
          >
            {copied ? 'تم النسخ ✓' : 'نسخ'}
          </button>

          <button
            type="button"
            onClick={onClear}
            className="rounded-full border border-white/15 bg-white/5 px-3 py-2 text-xs text-white/80 transition hover:bg-white/10 hover:border-white/25 disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={!text.length}
            aria-label="Clear journal"
          >
            مسح
          </button>
        </div>
      </div>

      {/* Textarea */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        className="mt-4 w-full resize-y rounded-2xl border border-white/10 bg-black/40 p-4 text-sm leading-7 text-white/90 outline-none placeholder:text-white/35 focus:border-white/20 transition"
        placeholder="اكتب هنا… حتى لو سطرين. المهم تترك أثر."
        dir="rtl"
      />

      {/* Footer info */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-white/45">
          حفظ تلقائي — آخر حفظ: {savedLabel}
        </p>
        <p className="text-xs text-white/45">
          يبقى محفوظ عندك (LocalStorage)
        </p>
      </div>
    </section>
  );
}
