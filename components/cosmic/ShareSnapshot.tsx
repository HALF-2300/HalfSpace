'use client';

import React, { useMemo, useState } from 'react';
import { makeCosmicSnapshot, type CosmicLocale } from '@/lib/cosmic/snapshot';

interface ShareSnapshotProps {
  locale: CosmicLocale;
  salt?: number;
  pagePath?: string;
}

/**
 * Share Snapshot Component
 * Allows copying snapshot text, link, or using Web Share API
 */
export default function ShareSnapshot({
  locale,
  salt = 0,
  pagePath = '/cosmic-oddities',
}: ShareSnapshotProps) {
  const snap = useMemo(() => makeCosmicSnapshot(locale, salt), [locale, salt]);
  const [copiedSnap, setCopiedSnap] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [shared, setShared] = useState(false);

  // Generate shareable link
  const link = useMemo(() => {
    if (typeof window === 'undefined') return pagePath;
    const url = new URL(window.location.href);
    url.searchParams.set('lang', locale);
    return url.toString();
  }, [locale, pagePath]);

  // Copy to clipboard helper
  const copy = async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  };

  // Copy snapshot text
  const onCopySnap = async () => {
    const ok = await copy(snap.text);
    if (ok) {
      setCopiedSnap(true);
      setTimeout(() => setCopiedSnap(false), 1100);
    }
  };

  // Copy link
  const onCopyLink = async () => {
    const ok = await copy(link);
    if (ok) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 1100);
    }
  };

  // Web Share API (mobile-friendly)
  const onShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: snap.title,
          text: snap.text,
          url: link,
        });
        setShared(true);
        setTimeout(() => setShared(false), 1200);
      } else {
        // Fallback: copy snapshot
        await onCopySnap();
      }
    } catch {
      // User cancelled or not supported
    }
  };

  // UI labels
  const ui = locale === 'ar'
    ? {
        h: 'مشاركة لقطة',
        d: 'نص قصير جاهز… انسخه وارسله.',
        snap: 'نسخ اللقطة',
        link: 'نسخ الرابط',
        share: 'مشاركة',
        done: 'تم ✓',
      }
    : {
        h: 'Share Snapshot',
        d: 'A ready-to-send tiny excerpt.',
        snap: 'Copy snapshot',
        link: 'Copy link',
        share: 'Share',
        done: 'Done ✓',
      };

  return (
    <section className="max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      {/* Header with actions */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs tracking-[0.28em] text-white/60">{ui.h}</p>
          <p className="mt-2 text-sm leading-7 text-white/75">{ui.d}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCopySnap}
            className="rounded-full border border-white/15 bg-white/5 px-3 py-2 text-xs text-white/85 transition hover:bg-white/10 hover:border-white/25"
            aria-label="Copy snapshot text"
          >
            {copiedSnap ? ui.done : ui.snap}
          </button>

          <button
            type="button"
            onClick={onCopyLink}
            className="rounded-full border border-white/15 bg-white/5 px-3 py-2 text-xs text-white/85 transition hover:bg-white/10 hover:border-white/25"
            aria-label="Copy page link"
          >
            {copiedLink ? ui.done : ui.link}
          </button>

          <button
            type="button"
            onClick={onShare}
            className="rounded-full border border-white/15 bg-white/5 px-3 py-2 text-xs text-white/85 transition hover:bg-white/10 hover:border-white/25"
            title="Web Share API"
            aria-label="Share via Web Share API"
          >
            {shared ? ui.done : ui.share}
          </button>
        </div>
      </div>

      {/* Snapshot preview */}
      <pre 
        className="mt-4 whitespace-pre-wrap rounded-2xl border border-white/10 bg-black/35 p-4 text-sm leading-7 text-white/85"
        style={{ 
          direction: locale === 'ar' ? 'rtl' : 'ltr',
          fontFamily: locale === 'ar' ? 'Cairo, sans-serif' : 'Courier New, monospace'
        }}
      >
{snap.text}
      </pre>
    </section>
  );
}
