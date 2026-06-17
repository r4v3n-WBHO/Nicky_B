import type { Metadata } from "next";
import Link from "next/link";
import { getFaq } from "@/lib/content";
import { site } from "@/data/site";
import { faqJsonLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "FAQ & Shipping",
  description:
    "Common questions about ordering, payment, delivery and caring for a hand-made knife by Nicky Badenhorst.",
  alternates: { canonical: `${site.url}/faq/` },
};

export default function FaqPage() {
  const faq = getFaq();

  return (
    <div className="container-px py-10 sm:py-14">
      {faq.length > 0 && <JsonLd data={faqJsonLd(faq)} />}

      <header className="max-w-2xl">
        <h1 className="font-serif text-3xl text-steel-50 sm:text-4xl">FAQ &amp; shipping</h1>
        <p className="mt-3 text-steel-300">
          The common questions about ordering, payment, delivery and looking after a
          hand-made knife. Can&apos;t find your answer?{" "}
          <Link href="/contact" className="text-forge-300 hover:underline">Ask Nicky</Link>.
        </p>
      </header>

      <div className="mt-8 max-w-2xl divide-y divide-steel-800 border-y border-steel-800">
        {faq.map((item, i) => (
          <details key={i} open={i === 0} className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
              <span className="font-serif text-lg text-steel-100">{item.question}</span>
              <svg
                className="h-5 w-5 shrink-0 text-forge-300 transition-transform group-open:rotate-45"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
              </svg>
            </summary>
            <p className="mt-3 whitespace-pre-line text-steel-300">{item.answer}</p>
          </details>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/store" className="btn-secondary">Browse the store</Link>
        <Link href="/custom" className="btn-primary">Design your knife</Link>
      </div>
    </div>
  );
}
