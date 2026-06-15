"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { submitInquiry } from "@/lib/submitInquiry";
import { site } from "@/data/site";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const searchParams = useSearchParams();
  const presetMessage = searchParams.get("about") ?? "";
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setError("");

    const result = await submitInquiry({
      kind: "contact",
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      phone: String(data.get("phone") || ""),
      message: String(data.get("message") || ""),
    });

    if (result.ok) {
      setStatus("sent");
      form.reset();
    } else {
      setStatus("error");
      setError(result.error);
    }
  }

  if (status === "sent") {
    return (
      <div className="card p-6 text-center">
        <h3 className="font-serif text-xl text-forge-300">Thank you!</h3>
        <p className="mt-2 text-steel-300">
          Your message has been sent. Nicky will get back to you soon. For anything
          urgent, call <a className="text-forge-300 hover:underline" href={`tel:${site.phoneHref}`}>{site.phone}</a>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="name">Name</label>
          <input className="field-input" id="name" name="name" required autoComplete="name" />
        </div>
        <div>
          <label className="field-label" htmlFor="phone">Phone</label>
          <input className="field-input" id="phone" name="phone" inputMode="tel" autoComplete="tel" />
        </div>
      </div>
      <div>
        <label className="field-label" htmlFor="email">Email</label>
        <input className="field-input" id="email" name="email" type="email" autoComplete="email" />
      </div>
      <div>
        <label className="field-label" htmlFor="message">Message</label>
        <textarea
          className="field-input min-h-[120px]"
          id="message"
          name="message"
          required
          defaultValue={presetMessage}
        />
      </div>

      <p className="text-xs text-steel-500">
        Provide an email or phone number so Nicky can reply.
      </p>

      {status === "error" && (
        <p className="rounded-md border border-red-500/40 bg-red-950/40 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      <button type="submit" className="btn-primary w-full sm:w-auto" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
