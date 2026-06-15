import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name}.`,
};

export default function ContactPage() {
  return (
    <div className="container-px py-14">
      <header className="max-w-2xl">
        <h1 className="font-serif text-3xl text-steel-50 sm:text-4xl">Contact</h1>
        <p className="mt-3 text-steel-300">
          Questions, commissions or just want to talk knives? Drop a message below
          or call Nicky directly.
        </p>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr,320px]">
        <Suspense fallback={<div className="card p-6 text-steel-400">Loading…</div>}>
          <ContactForm />
        </Suspense>

        <aside className="space-y-6">
          <div className="card p-6">
            <h2 className="font-serif text-lg text-steel-50">Get in touch</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <span className="text-steel-500">Phone</span>
                <a href={`tel:${site.phoneHref}`} className="text-forge-300 hover:underline">
                  {site.phone}
                </a>
              </li>
              {site.email && (
                <li className="flex items-center gap-3">
                  <span className="text-steel-500">Email</span>
                  <a href={`mailto:${site.email}`} className="text-forge-300 hover:underline">
                    {site.email}
                  </a>
                </li>
              )}
              {site.socials.whatsapp && (
                <li className="flex items-center gap-3">
                  <span className="text-steel-500">WhatsApp</span>
                  <a
                    href={site.socials.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-forge-300 hover:underline"
                  >
                    Message on WhatsApp
                  </a>
                </li>
              )}
              <li className="flex items-center gap-3">
                <span className="text-steel-500">Based in</span>
                <span className="text-steel-200">{site.location}</span>
              </li>
            </ul>
          </div>

          <div className="card p-6">
            <h2 className="font-serif text-lg text-steel-50">Custom orders</h2>
            <p className="mt-2 text-sm text-steel-300">
              Want a knife built to your spec? Use the custom order builder for the
              quickest quote.
            </p>
            <Link href="/custom" className="btn-secondary mt-4 w-full">Design your knife</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
