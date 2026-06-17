"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { templates, getTemplate } from "@/data/templates";
import type { CustomConfig } from "@/lib/content";
import { formActionUrl } from "@/lib/submitInquiry";
import HoneypotField from "@/components/HoneypotField";
import { site } from "@/data/site";
import { asset } from "@/lib/asset";

type Status = "idle" | "sending" | "sent" | "error";

const BLADE_MIN_MM = 50;
const BLADE_STEP_MM = 5;

// Labels/help for the option dropdowns — the choices come from the CMS config.
const OPTION_META = {
  bladeShape: { label: "Blade shape", help: "The overall profile of the blade." },
  steel: { label: "Steel", help: "Stainless resists rust; carbon steels take a very keen edge." },
  handleMaterial: { label: "Handle material", help: undefined as string | undefined },
  sheath: { label: "Sheath", help: undefined as string | undefined },
};

type Selections = {
  templateName: string;
  bladeShape: string;
  steel: string;
  handleMaterial: string;
  sheath: string;
  bladeLengthMm: number;
  quantity: number;
};

const SCRATCH = "scratch";
const SINK_NAME = "custom-order-sink";

function defaultsFor(slug: string, config: CustomConfig): Selections {
  const t = slug === SCRATCH ? undefined : getTemplate(slug);
  const pick = (val: string | undefined, list: string[]) =>
    val && list.includes(val) ? val : list[0];
  return {
    templateName: t ? t.name : "Custom (from scratch)",
    bladeShape: pick(t?.defaults.bladeShape, config.bladeShapes),
    steel: pick(t?.defaults.steel, config.steels),
    handleMaterial: pick(t?.defaults.handleMaterial, config.handleMaterials),
    sheath: config.sheaths[0],
    bladeLengthMm: Math.min(t?.defaults.bladeLengthMm ?? 110, config.bladeLengthMaxMm),
    quantity: 1,
  };
}

export default function CustomOrderBuilder({ config }: { config: CustomConfig }) {
  const initialTemplateSlug = useSearchParams().get("template") ?? undefined;
  const validInitial =
    initialTemplateSlug && getTemplate(initialTemplateSlug)
      ? initialTemplateSlug
      : SCRATCH;

  const [selectedSlug, setSelectedSlug] = useState<string>(validInitial);
  const [sel, setSel] = useState<Selections>(() => defaultsFor(validInitial, config));
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const expecting = useRef(false);

  const filesMb = files.reduce((n, f) => n + f.size, 0) / (1024 * 1024);
  const waBase =
    site.socials.whatsapp || `https://wa.me/${site.phoneHref.replace(/\D/g, "")}`;

  function pickTemplate(slug: string) {
    setSelectedSlug(slug);
    setSel(defaultsFor(slug, config));
  }

  function update<K extends keyof Selections>(key: K, value: Selections[K]) {
    setSel((s) => ({ ...s, [key]: value }));
  }

  const summary = useMemo(
    () => ({
      "Starting point": sel.templateName,
      "Blade shape": sel.bladeShape,
      "Blade length": `${sel.bladeLengthMm} mm`,
      Steel: sel.steel,
      "Handle material": sel.handleMaterial,
      Sheath: sel.sheath,
      Quantity: String(sel.quantity),
    }),
    [sel],
  );

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    if (!email && !phone) {
      e.preventDefault();
      setStatus("error");
      setError("Please add an email or phone number so Nicky can reply.");
      return;
    }
    if (filesMb > 10) {
      e.preventDefault();
      setStatus("error");
      setError("Photos are too large — keep the total under 10 MB.");
      return;
    }
    // Let the native multipart POST proceed into the hidden iframe: FormSubmit's
    // AJAX endpoint can't carry file attachments, but a real form POST can, and
    // the iframe keeps the visitor here so we can show the confirmation below.
    setError("");
    setStatus("sending");
    expecting.current = true;
    // Safety net in case the iframe never reports back (e.g. offline).
    window.setTimeout(() => {
      if (expecting.current) {
        expecting.current = false;
        setStatus("sent");
      }
    }, 8000);
  }

  function handleSinkLoad() {
    if (!expecting.current) return; // ignore the iframe's initial empty load
    expecting.current = false;
    setStatus("sent");
  }

  function openWhatsApp() {
    const data = new FormData(formRef.current ?? undefined);
    const lines = ["Hi Nicky, I'd like a quote for a custom knife:"];
    for (const [k, v] of Object.entries(summary)) lines.push(`• ${k}: ${v}`);
    const name = String(data.get("name") || "");
    const notes = String(data.get("message") || "");
    if (name) lines.push("", `Name: ${name}`);
    if (notes) lines.push(`Notes: ${notes}`);
    lines.push("", "(I'll attach reference photos here in the chat.)");
    window.open(
      `${waBase}?text=${encodeURIComponent(lines.join("\n"))}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  if (status === "sent") {
    return (
      <div className="card mx-auto max-w-xl p-8 text-center">
        <h3 className="font-serif text-2xl text-forge-300">Request received</h3>
        <p className="mt-3 text-steel-300">
          Thanks — your custom knife request has been sent to Nicky. He&apos;ll be in
          touch to confirm the details, timeline and price. For anything urgent,
          call <a className="text-forge-300 hover:underline" href={`tel:${site.phoneHref}`}>{site.phone}</a>.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Submissions post here so the page doesn't navigate away. */}
      <iframe
        name={SINK_NAME}
        title="Custom order"
        aria-hidden="true"
        tabIndex={-1}
        className="hidden"
        onLoad={handleSinkLoad}
      />
      <form
        ref={formRef}
        action={formActionUrl}
        method="POST"
        encType="multipart/form-data"
        target={SINK_NAME}
        onSubmit={onSubmit}
        className="grid gap-8 lg:grid-cols-[1fr,360px]"
      >
        <HoneypotField />
        <input type="hidden" name="_subject" value="New custom knife order (website)" />
        <input type="hidden" name="_template" value="table" />
        <input type="hidden" name="_captcha" value="false" />
        {/* The live spec selections, sent as form fields. */}
        {Object.entries(summary).map(([k, v]) => (
          <input key={k} type="hidden" name={k} value={String(v)} />
        ))}
        {/* Left: builder */}
      <div className="space-y-8">
        {/* Step 1 — template */}
        <section>
          <h2 className="font-serif text-xl text-steel-50">
            1. Choose a starting point
          </h2>
          <p className="mt-1 text-sm text-steel-400">
            Pick a style to customise, or start from scratch.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {templates.map((t) => (
              <button
                type="button"
                key={t.slug}
                onClick={() => pickTemplate(t.slug)}
                className={`card flex gap-3 p-3 text-left transition-colors ${
                  selectedSlug === t.slug
                    ? "border-forge-500 ring-1 ring-forge-500"
                    : "hover:border-steel-600"
                }`}
              >
                <div className="relative h-16 w-20 flex-none overflow-hidden rounded bg-gradient-to-b from-steel-800 to-steel-950">
                  <Image src={asset(t.image)} alt={t.name} fill className="object-contain p-1" sizes="80px" />
                </div>
                <div>
                  <div className="font-medium text-steel-100">{t.name}</div>
                  <div className="text-xs text-steel-400">{t.description}</div>
                </div>
              </button>
            ))}
            <button
              type="button"
              onClick={() => pickTemplate(SCRATCH)}
              className={`card flex items-center justify-center p-3 text-center transition-colors ${
                selectedSlug === SCRATCH
                  ? "border-forge-500 ring-1 ring-forge-500"
                  : "hover:border-steel-600"
              }`}
            >
              <div>
                <div className="font-medium text-steel-100">Start from scratch</div>
                <div className="text-xs text-steel-400">Design something completely custom</div>
              </div>
            </button>
          </div>
        </section>

        {/* Step 2 — options */}
        <section>
          <h2 className="font-serif text-xl text-steel-50">2. Customise it</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <SelectField
              label={OPTION_META.bladeShape.label}
              help={OPTION_META.bladeShape.help}
              value={sel.bladeShape}
              choices={config.bladeShapes}
              onChange={(v) => update("bladeShape", v)}
            />
            <SelectField
              label={OPTION_META.steel.label}
              help={OPTION_META.steel.help}
              value={sel.steel}
              choices={config.steels}
              onChange={(v) => update("steel", v)}
            />
            <SelectField
              label={OPTION_META.handleMaterial.label}
              value={sel.handleMaterial}
              choices={config.handleMaterials}
              onChange={(v) => update("handleMaterial", v)}
            />
            <SelectField
              label={OPTION_META.sheath.label}
              value={sel.sheath}
              choices={config.sheaths}
              onChange={(v) => update("sheath", v)}
            />
          </div>

          <div className="mt-4">
            <label className="field-label" htmlFor="bladeLength">
              Blade length: <span className="text-forge-300">{sel.bladeLengthMm} mm</span>
            </label>
            <input
              id="bladeLength"
              type="range"
              min={BLADE_MIN_MM}
              max={config.bladeLengthMaxMm}
              step={BLADE_STEP_MM}
              value={sel.bladeLengthMm}
              onChange={(e) => update("bladeLengthMm", Number(e.target.value))}
              className="w-full accent-forge-500"
            />
            <div className="flex justify-between text-xs text-steel-500">
              <span>{BLADE_MIN_MM} mm</span>
              <span>{config.bladeLengthMaxMm} mm</span>
            </div>
          </div>

          <div className="mt-4 max-w-[140px]">
            <label className="field-label" htmlFor="quantity">Quantity</label>
            <input
              id="quantity"
              type="number"
              min={1}
              max={50}
              value={sel.quantity}
              onChange={(e) => update("quantity", Math.max(1, Number(e.target.value) || 1))}
              className="field-input"
            />
          </div>
        </section>

        {/* Step 3 — your details */}
        <section>
          <h2 className="font-serif text-xl text-steel-50">3. Your details</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="name">Name</label>
              <input className="field-input" id="name" name="name" autoComplete="name" />
            </div>
            <div>
              <label className="field-label" htmlFor="phone">Phone</label>
              <input className="field-input" id="phone" name="phone" inputMode="tel" autoComplete="tel" />
            </div>
            <div className="sm:col-span-2">
              <label className="field-label" htmlFor="email">Email</label>
              <input className="field-input" id="email" name="email" type="email" autoComplete="email" />
            </div>
            <div className="sm:col-span-2">
              <label className="field-label" htmlFor="message">
                Anything else? (engraving, deadline, budget…)
              </label>
              <textarea className="field-input min-h-[110px]" id="message" name="message" />
            </div>
            <div className="sm:col-span-2">
              <label className="field-label" htmlFor="photos">
                Reference photos or sketches (optional)
              </label>
              <input
                id="photos"
                name="Reference photo"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
                className="block w-full text-sm text-steel-300 file:mr-3 file:rounded-md file:border-0 file:bg-steel-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-steel-100 hover:file:bg-steel-600"
              />
              {files.length > 0 && (
                <p className={`mt-1 text-xs ${filesMb > 10 ? "text-red-400" : "text-steel-500"}`}>
                  {files.length} photo{files.length > 1 ? "s" : ""} selected ({filesMb.toFixed(1)} MB
                  {filesMb > 10 ? " — too large, keep under 10 MB" : " / 10 MB max"})
                </p>
              )}
            </div>
          </div>
          <p className="mt-2 text-xs text-steel-500">
            Email your request (attach photos above), or send it straight to Nicky on
            WhatsApp. Either way, include a phone or email so he can reply. See our{" "}
            <Link href="/privacy" className="underline hover:text-forge-300">privacy note</Link>.
          </p>
        </section>
      </div>

      {/* Right: live summary */}
      <aside className="lg:sticky lg:top-20 lg:self-start">
        <div className="card p-5">
          <h3 className="font-serif text-lg text-steel-50">Your knife</h3>
          <dl className="mt-4 space-y-2 text-sm">
            {Object.entries(summary).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b border-steel-800 pb-2">
                <dt className="text-steel-400">{k}</dt>
                <dd className="text-right text-steel-100">{v}</dd>
              </div>
            ))}
          </dl>

          {status === "error" && (
            <p className="mt-4 rounded-md border border-red-500/40 bg-red-950/40 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="btn-primary mt-5 w-full"
            disabled={status === "sending" || filesMb > 10}
          >
            {status === "sending" ? "Sending…" : "Request a quote by email"}
          </button>
          <button type="button" onClick={openWhatsApp} className="btn-secondary mt-2 w-full">
            <WhatsAppIcon />
            Or send on WhatsApp
          </button>
          <p className="mt-3 text-center text-xs text-steel-500">
            No payment now — Nicky confirms details &amp; price first.
          </p>
        </div>
      </aside>
      </form>
    </>
  );
}

function SelectField({
  label,
  help,
  value,
  choices,
  onChange,
}: {
  label: string;
  help?: string;
  value: string;
  choices: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <select
        className="field-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {choices.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      {help && <p className="mt-1 text-xs text-steel-500">{help}</p>}
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.513 5.26l-.999 3.648 3.476-.91zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>
  );
}
