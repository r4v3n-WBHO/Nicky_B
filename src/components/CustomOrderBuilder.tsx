"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { templates, getTemplate } from "@/data/templates";
import type { CustomConfig } from "@/lib/content";
import { submitInquiry } from "@/lib/submitInquiry";
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

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setError("");

    const result = await submitInquiry({
      kind: "custom-order",
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      phone: String(data.get("phone") || ""),
      message: String(data.get("message") || ""),
      details: summary,
    });

    if (result.ok) {
      setStatus("sent");
    } else {
      setStatus("error");
      setError(result.error);
    }
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
    <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-[1fr,360px]">
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

        {/* Step 3 — contact */}
        <section>
          <h2 className="font-serif text-xl text-steel-50">3. Your details</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="name">Name</label>
              <input className="field-input" id="name" name="name" required autoComplete="name" />
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
          </div>
          <p className="mt-2 text-xs text-steel-500">
            Provide an email or phone number so Nicky can reply with a quote. Got
            reference photos or sketches?{" "}
            {site.socials.whatsapp ? (
              <>
                <a
                  href={site.socials.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-forge-300 hover:underline"
                >
                  WhatsApp them to Nicky
                </a>{" "}
                after submitting (mention your name).
              </>
            ) : (
              <>Send them to Nicky on {site.phone} after submitting.</>
            )}
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

          <button type="submit" className="btn-primary mt-5 w-full" disabled={status === "sending"}>
            {status === "sending" ? "Sending…" : "Request a quote"}
          </button>
          <p className="mt-3 text-center text-xs text-steel-500">
            No payment now — Nicky confirms details &amp; price first.
          </p>
        </div>
      </aside>
    </form>
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
