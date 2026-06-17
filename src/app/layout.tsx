import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { site } from "@/data/site";

// Privacy-friendly analytics (off until configured). Set NEXT_PUBLIC_PLAUSIBLE_DOMAIN
// to your site domain; works with plausible.io or any compatible/self-hosted
// endpoint via NEXT_PUBLIC_PLAUSIBLE_SRC. No cookies, POPIA/GDPR-friendly.
const analyticsDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
const analyticsSrc =
  process.env.NEXT_PUBLIC_PLAUSIBLE_SRC || "https://plausible.io/js/script.js";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const serif = Cinzel({ subsets: ["latin"], variable: "--font-serif", weight: ["500", "600", "700"] });

const ogImage = `${site.url}/images/uploads/skinners-pair.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.shortName} — ${site.tagline}`,
    template: `%s — ${site.shortName}`,
  },
  description: site.description,
  openGraph: {
    title: site.name,
    description: site.description,
    type: "website",
    url: site.url,
    siteName: site.shortName,
    images: [{ url: ogImage, width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
    images: [ogImage],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body className="flex min-h-screen flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        {analyticsDomain && (
          <Script defer data-domain={analyticsDomain} src={analyticsSrc} strategy="afterInteractive" />
        )}
      </body>
    </html>
  );
}
