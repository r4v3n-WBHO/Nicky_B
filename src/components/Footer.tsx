import Link from "next/link";
import { site } from "@/data/site";
import NewsletterForm from "@/components/NewsletterForm";
import { newsletterConfigured } from "@/lib/newsletter";

export default function Footer() {
  return (
    <footer className="border-t border-steel-800 bg-steel-950">
      {newsletterConfigured && (
        <div className="border-b border-steel-800/70">
          <div className="container-px flex flex-col gap-5 py-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-md">
              <h3 className="font-serif text-lg text-steel-50">Never miss a show</h3>
              <p className="mt-1 text-sm text-steel-400">
                Join the list for the occasional email when new knives are ready and
                where to find Nicky next.
              </p>
            </div>
            <div className="w-full md:w-80 md:shrink-0">
              <NewsletterForm />
            </div>
          </div>
        </div>
      )}
      <div className="container-px grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <h3 className="font-serif text-lg text-steel-50">{site.name}</h3>
          <p className="mt-2 max-w-xs text-sm text-steel-400">{site.description}</p>
        </div>

        <nav aria-label="Footer">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-steel-400">
            Explore
          </h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/" className="text-steel-300 hover:text-forge-300">Home</Link></li>
            <li><Link href="/gallery" className="text-steel-300 hover:text-forge-300">The Work</Link></li>
            <li><Link href="/store" className="text-steel-300 hover:text-forge-300">Store</Link></li>
            <li><Link href="/custom" className="text-steel-300 hover:text-forge-300">Custom Order</Link></li>
            <li><Link href="/faq" className="text-steel-300 hover:text-forge-300">FAQ &amp; shipping</Link></li>
            <li><Link href="/contact" className="text-steel-300 hover:text-forge-300">Contact</Link></li>
          </ul>
        </nav>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-steel-400">
            Get in touch
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-steel-300">
            <li>
              <a href={`tel:${site.phoneHref}`} className="hover:text-forge-300">
                {site.phone}
              </a>
            </li>
            {site.email && (
              <li>
                <a href={`mailto:${site.email}`} className="hover:text-forge-300">
                  {site.email}
                </a>
              </li>
            )}
            {site.socials.whatsapp && (
              <li>
                <a
                  href={site.socials.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-forge-300"
                >
                  WhatsApp
                </a>
              </li>
            )}
            <li className="text-steel-500">{site.location}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-steel-800/70">
        <div className="container-px flex flex-col items-center justify-between gap-2 py-5 text-xs text-steel-500 sm:flex-row">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-forge-300">Privacy</Link>
            <span>Handmade in {site.location}.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
