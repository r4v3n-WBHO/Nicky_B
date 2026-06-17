"use client";

import Link from "next/link";
import { useState } from "react";
import { submitInquiry } from "@/lib/submitInquiry";
import HoneypotField from "@/components/HoneypotField";

/**
 * Events-newsletter signup. Submitting emails the address (and optional name) to
 * Nicky via FormSubmit — the same path as the contact form — so he can add the
 * person to however he sends updates. Shows accurate success/error states.
 */
type Status = "idle" | "sending" | "sent" | "error";

export default function NewsletterForm({ onSuccess }: { onSuccess?: () => void }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setError("");

    const result = await submitInquiry({
      kind: "newsletter",
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      honeypot: String(data.get("_honey") || ""),
    });

    if (result.ok) {
      setStatus("sent");
      form.reset();
      onSuccess?.();
    } else {
      setStatus("error");
      setError(result.error);
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-lg border border-forge-600/40 bg-forge-950/20 p-4 text-sm">
        <p className="font-medium text-forge-300">Thanks — you&apos;re on the list.</p>
        <p className="mt-1 text-steel-300">
          Nicky will be in touch about new knives and upcoming shows.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <HoneypotField />
      <input
        type="text"
        name="name"
        aria-label="First name"
        placeholder="First name (optional)"
        autoComplete="given-name"
        className="field-input"
      />
      <input
        type="email"
        name="email"
        required
        aria-label="Email address"
        placeholder="you@example.com"
        autoComplete="email"
        className="field-input"
      />
      {status === "error" && (
        <p className="rounded-md border border-red-500/40 bg-red-950/40 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}
      <button type="submit" className="btn-primary w-full" disabled={status === "sending"}>
        {status === "sending" ? "Signing up…" : "Sign me up"}
      </button>
      <p className="text-xs text-steel-500">
        Occasional event &amp; new-knife updates, straight from Nicky. No spam —
        unsubscribe anytime.{" "}
        <Link href="/privacy" className="underline hover:text-forge-300">Privacy</Link>.
      </p>
    </form>
  );
}
