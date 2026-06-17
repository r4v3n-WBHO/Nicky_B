"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import NewsletterForm from "@/components/NewsletterForm";

/**
 * A one-time, dismissible "join the newsletter" popup that slides in from the
 * corner. It's deliberately gentle: shows after a short delay, never on the
 * enquiry pages, and remembers (in localStorage) once dismissed or subscribed so
 * repeat visitors aren't nagged. Only mounted when the newsletter is configured
 * (see layout.tsx).
 */
const STORAGE_KEY = "nb_newsletter_dismissed";
const DELAY_MS = 12000;
// Don't interrupt anyone who's already mid-enquiry.
const SUPPRESSED = ["/contact", "/custom"];

export default function NewsletterPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false); // drives the enter/leave transition

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setShown(false);
    setTimeout(() => setOpen(false), 200);
  }, []);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      return;
    }
    if (SUPPRESSED.some((p) => pathname?.startsWith(p))) return;
    const t = setTimeout(() => setOpen(true), DELAY_MS);
    return () => clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const r = requestAnimationFrame(() => setShown(true));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(r);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, dismiss]);

  if (!open) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center p-4 sm:inset-x-auto sm:bottom-4 sm:right-4 sm:justify-end">
      <div
        role="dialog"
        aria-labelledby="nl-popup-title"
        className={`card relative w-full max-w-sm p-5 transition-all duration-200 motion-reduce:transition-none ${
          shown ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close"
          className="absolute right-2.5 top-2.5 rounded p-1 text-steel-500 hover:bg-steel-800 hover:text-steel-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forge-400"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        <h2 id="nl-popup-title" className="pr-6 font-serif text-lg text-steel-50">
          Catch Nicky at the next show
        </h2>
        <p className="mt-1 text-sm text-steel-300">
          Get the occasional email when new knives are ready and where to find
          Nicky next.
        </p>
        <div className="mt-4">
          <NewsletterForm
            onSuccess={() => {
              try {
                localStorage.setItem(STORAGE_KEY, "1");
              } catch {
                /* ignore */
              }
              setTimeout(dismiss, 4000);
            }}
          />
        </div>
      </div>
    </div>
  );
}
