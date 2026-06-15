import type { Metadata } from "next";
import { Suspense } from "react";
import CustomOrderBuilder from "@/components/CustomOrderBuilder";
import { getCustomConfig } from "@/lib/content";

export const metadata: Metadata = {
  title: "Custom Order",
  description:
    "Design your own hand-made knife. Start from a template or build from scratch and request a quote from Nicky Badenhorst.",
};

export default function CustomPage() {
  const config = getCustomConfig();
  return (
    <div className="container-px py-10 sm:py-14">
      <header className="max-w-2xl">
        <h1 className="font-serif text-3xl text-steel-50 sm:text-4xl">
          Design your knife
        </h1>
        <p className="mt-3 text-steel-300">
          Pick a starting point and make it your own, or design something completely
          custom. Send your spec to Nicky and he&apos;ll reply with a quote and
          timeline — no payment until the details are agreed.
        </p>
      </header>

      <div className="mt-10">
        <Suspense fallback={<p className="text-steel-400">Loading…</p>}>
          <CustomOrderBuilder config={config} />
        </Suspense>
      </div>
    </div>
  );
}
