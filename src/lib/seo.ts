import { site } from "@/data/site";
import type { Product } from "@/lib/content";

/**
 * Helpers that build schema.org structured data (JSON-LD) for the pages.
 * Kept dependency-free (only the site config + a type) so it can be imported
 * from any server component. Render the output with the <JsonLd> component.
 */

/** Absolute URL on the deployed site. `site.url` already includes any base path. */
export const abs = (path: string) => `${site.url}${path}`;

const socials = Object.values(site.socials).filter(Boolean);

/** Brand + maker identity. Rendered once, on the home page. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": abs("/#organization"),
        name: site.name,
        url: abs("/"),
        logo: abs("/nicky_b_logo.jpg"),
        image: abs("/images/uploads/skinners-pair.jpg"),
        telephone: site.phoneHref,
        founder: { "@type": "Person", name: "Nicky Badenhorst" },
        areaServed: { "@type": "Country", name: "South Africa" },
        ...(socials.length ? { sameAs: socials } : {}),
      },
      {
        "@type": "Person",
        "@id": abs("/#maker"),
        name: "Nicky Badenhorst",
        jobTitle: "Knifemaker",
        url: abs("/"),
        worksFor: { "@id": abs("/#organization") },
      },
      {
        "@type": "WebSite",
        "@id": abs("/#website"),
        name: site.shortName,
        url: abs("/"),
        publisher: { "@id": abs("/#organization") },
      },
    ],
  };
}

/** Product details + breadcrumb trail for a product page. */
export function productJsonLd(product: Product) {
  const url = abs(`/store/${product.slug}/`);
  // Use the original (background-on) uploads for sharing/structured data —
  // the displayed images are background-removed WebPs, which OG scrapers and
  // rich results handle poorly.
  const images = product.rawImages.map(abs);
  const blurb = product.description || product.tagline;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${url}#product`,
        name: product.name,
        ...(blurb ? { description: blurb } : {}),
        ...(images.length ? { image: images } : {}),
        ...(product.category ? { category: product.category } : {}),
        brand: { "@type": "Brand", name: "Nicky Badenhorst" },
        url,
        offers: {
          "@type": "Offer",
          url,
          priceCurrency: "ZAR",
          availability: product.inStock
            ? "https://schema.org/InStock"
            : "https://schema.org/SoldOut",
          itemCondition: "https://schema.org/NewCondition",
          seller: { "@type": "Organization", name: site.name },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: abs("/") },
          { "@type": "ListItem", position: 2, name: "Store", item: abs("/store/") },
          { "@type": "ListItem", position: 3, name: product.name, item: url },
        ],
      },
    ],
  };
}

/** FAQ rich-result markup for the FAQ page. */
export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.question,
      acceptedAnswer: { "@type": "Answer", text: i.answer },
    })),
  };
}
