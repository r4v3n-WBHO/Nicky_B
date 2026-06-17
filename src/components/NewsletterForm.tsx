"use client";

import { useId, useRef, useState } from "react";
import { newsletter } from "@/lib/newsletter";

/**
 * Email signup that posts to the configured provider (MailerLite/Brevo) without
 * navigating away: the form targets a hidden iframe, and the iframe's load is
 * treated as completion. With the provider's double opt-in the visitor confirms
 * by email, so showing an optimistic "subscribed" state is safe. With no JS the
 * native POST still works — the visitor just doesn't see the inline confirmation.
 */
export default function NewsletterForm({ onSuccess }: { onSuccess?: () => void }) {
  const sinkName = `nl-sink-${useId().replace(/:/g, "")}`;
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const expecting = useRef(false);

  function handleSubmit() {
    // Don't preventDefault — let the browser POST into the hidden iframe.
    expecting.current = true;
    setStatus("sending");
  }

  function handleSinkLoad() {
    if (!expecting.current) return; // ignore the iframe's initial empty load
    expecting.current = false;
    setStatus("sent");
    onSuccess?.();
  }

  if (status === "sent") {
    return (
      <div className="rounded-lg border border-forge-600/40 bg-forge-950/20 p-4 text-sm">
        <p className="font-medium text-forge-300">You&apos;re on the list.</p>
        <p className="mt-1 text-steel-300">
          Check your inbox to confirm — then you&apos;ll hear about new knives and
          where to find Nicky next.
        </p>
      </div>
    );
  }

  return (
    <div>
      <iframe
        name={sinkName}
        title="Newsletter signup"
        aria-hidden="true"
        tabIndex={-1}
        className="hidden"
        onLoad={handleSinkLoad}
      />
      <form
        action={newsletter.actionUrl}
        method="POST"
        target={sinkName}
        onSubmit={handleSubmit}
        className="space-y-2"
      >
        {Object.entries(newsletter.hiddenFields).map(([k, v]) => (
          <input key={k} type="hidden" name={k} value={v} />
        ))}
        {newsletter.nameField && (
          <input
            type="text"
            name={newsletter.nameField}
            aria-label="First name"
            placeholder="First name (optional)"
            autoComplete="given-name"
            className="field-input"
          />
        )}
        <input
          type="email"
          name={newsletter.emailField}
          required
          aria-label="Email address"
          placeholder="you@example.com"
          autoComplete="email"
          className="field-input"
        />
        <button type="submit" className="btn-primary w-full" disabled={status === "sending"}>
          {status === "sending" ? "Subscribing…" : "Subscribe"}
        </button>
      </form>
      <p className="mt-2 text-xs text-steel-500">
        Occasional event &amp; new-knife updates. No spam — unsubscribe anytime.
      </p>
    </div>
  );
}
