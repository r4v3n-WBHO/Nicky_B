import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: `How ${site.name} handles the information you share through this site.`,
  alternates: { canonical: `${site.url}/privacy/` },
};

export default function PrivacyPage() {
  return (
    <div className="container-px py-10 sm:py-14">
      <article className="max-w-2xl space-y-6 text-steel-300">
        <header>
          <h1 className="font-serif text-3xl text-steel-50 sm:text-4xl">Privacy</h1>
          <p className="mt-3">
            {site.name} is a small, one-person business. We only use the details
            you choose to share, and only to reply to you or send updates you
            asked for — never sold or shared for marketing.
          </p>
        </header>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-steel-100">What we collect</h2>
          <p>
            Only what you send us through the site: your name, email, phone and
            message when you make an enquiry; any reference photos you attach to a
            custom-order request; and your email address if you sign up for event
            updates. There are no tracking cookies.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-steel-100">How we use it</h2>
          <p>
            To reply to your enquiry, prepare a quote, or send the occasional
            event and new-knife update you signed up for. Nothing else.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-steel-100">How it&apos;s handled</h2>
          <p>
            Enquiry and signup forms are delivered to Nicky by email through{" "}
            <a
              href="https://formsubmit.co"
              target="_blank"
              rel="noopener noreferrer"
              className="text-forge-300 hover:underline"
            >
              FormSubmit
            </a>
            , a form-to-email service. If you message on WhatsApp instead, that
            chat is covered by WhatsApp&apos;s own terms. Any visitor statistics we
            use are privacy-friendly and cookieless — they don&apos;t identify you.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-steel-100">Your choices</h2>
          <p>
            You can ask to see, correct or delete the information you&apos;ve
            shared, or stop receiving updates, at any time — just contact Nicky on{" "}
            <a href={`tel:${site.phoneHref}`} className="text-forge-300 hover:underline">
              {site.phone}
            </a>
            {site.socials.whatsapp && (
              <>
                {" "}
                or on{" "}
                <a
                  href={site.socials.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-forge-300 hover:underline"
                >
                  WhatsApp
                </a>
              </>
            )}
            {site.email && (
              <>
                , or email{" "}
                <a href={`mailto:${site.email}`} className="text-forge-300 hover:underline">
                  {site.email}
                </a>
              </>
            )}
            .
          </p>
        </section>

        <p className="text-sm text-steel-500">
          We may update this note as the site grows — the latest version always
          lives on this page.
        </p>

        <p>
          <Link href="/contact" className="text-forge-300 hover:underline">
            &larr; Back to contact
          </Link>
        </p>
      </article>
    </div>
  );
}
