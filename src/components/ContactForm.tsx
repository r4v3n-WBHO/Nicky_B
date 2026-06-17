"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { submitInquiry } from "@/lib/submitInquiry";
import HoneypotField from "@/components/HoneypotField";
import { site } from "@/data/site";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const searchParams = useSearchParams();
  const presetMessage = searchParams.get("about") ?? "";
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const waBase =
    site.socials.whatsapp || `https://wa.me/${site.phoneHref.replace(/\D/g, "")}`;

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
      honeypot: String(data.get("_honey") || ""),
    });

    if (result.ok) {
      setStatus("sent");
      form.reset();
    } else {
      setStatus("error");
      setError(result.error);
    }
  }

  function openWhatsApp() {
    const data = new FormData(formRef.current ?? undefined);
    const name = String(data.get("name") || "");
    const message = String(data.get("message") || "");
    const lines = [`Hi Nicky,${name ? ` it's ${name}.` : ""}`];
    if (message) lines.push("", message);
    window.open(
      `${waBase}?text=${encodeURIComponent(lines.join("\n"))}`,
      "_blank",
      "noopener,noreferrer",
    );
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
    <form ref={formRef} onSubmit={onSubmit} className="card space-y-4 p-6">
      <HoneypotField />
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
        Provide an email or phone number so Nicky can reply. See our{" "}
        <Link href="/privacy" className="underline hover:text-forge-300">privacy note</Link>.
      </p>

      {status === "error" && (
        <p className="rounded-md border border-red-500/40 bg-red-950/40 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <button type="submit" className="btn-primary" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
        <button type="button" onClick={openWhatsApp} className="btn-secondary">
          <WhatsAppIcon />
          Or send on WhatsApp
        </button>
      </div>
    </form>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.513 5.26l-.999 3.648 3.476-.91zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>
  );
}
