import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import ContactForm from "@/components/ContactForm";
import { site } from "@/data/site";
import { getAbout } from "@/lib/content";
import { asset } from "@/lib/asset";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name}.`,
};

export default function ContactPage() {
  const about = getAbout();

  return (
    <div className="container-px py-10 sm:py-14">
      {/* About / the maker */}
      {(about.body || about.heading) && (
        <section className="mb-16 grid items-center gap-8 md:grid-cols-[280px,1fr]">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[280px] overflow-hidden rounded-xl border border-steel-800 bg-gradient-to-b from-steel-800 to-steel-950">
            {about.image ? (
              <Image
                src={asset(about.image)}
                alt="Nicky Badenhorst"
                fill
                className="object-cover"
                sizes="280px"
              />
            ) : (
              <div className="flex h-full items-center justify-center px-6 text-center text-sm text-steel-500">
                A photo of Nicky goes here
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-forge-400">
              The maker
            </p>
            <h1 className="mt-2 font-serif text-3xl text-steel-50 sm:text-4xl">
              {about.heading}
            </h1>
            {about.body && (
              <p className="mt-4 max-w-xl whitespace-pre-line text-steel-300">{about.body}</p>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={`tel:${site.phoneHref}`} className="btn-primary">
                Call {site.phone}
              </a>
              <Link href="/custom" className="btn-secondary">Design your knife</Link>
            </div>
          </div>
        </section>
      )}

      {/* Get in touch */}
      <header className="max-w-2xl">
        <h2 className="font-serif text-2xl text-steel-50 sm:text-3xl">Get in touch</h2>
        <p className="mt-3 text-steel-300">
          Questions, commissions or just want to talk knives? Drop a message below
          or reach Nicky directly.
        </p>
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr,320px]">
        <Suspense fallback={<div className="card p-6 text-steel-400">Loading…</div>}>
          <ContactForm />
        </Suspense>

        <aside className="space-y-6">
          <div className="card p-6">
            <h3 className="font-serif text-lg text-steel-50">Contact details</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <span className="w-16 shrink-0 text-steel-500">Phone</span>
                <a href={`tel:${site.phoneHref}`} className="text-forge-300 hover:underline">
                  {site.phone}
                </a>
              </li>
              {site.email && (
                <li className="flex items-center gap-3">
                  <span className="w-16 shrink-0 text-steel-500">Email</span>
                  <a href={`mailto:${site.email}`} className="text-forge-300 hover:underline">
                    {site.email}
                  </a>
                </li>
              )}
              {site.socials.whatsapp && (
                <li className="flex items-center gap-3">
                  <span className="w-16 shrink-0 text-steel-500">WhatsApp</span>
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
                <span className="w-16 shrink-0 text-steel-500">Based in</span>
                <span className="text-steel-200">{site.location}</span>
              </li>
            </ul>
          </div>

          <div className="card p-6">
            <h3 className="font-serif text-lg text-steel-50">Custom orders</h3>
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
