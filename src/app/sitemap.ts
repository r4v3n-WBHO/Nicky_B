import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { getProducts } from "@/lib/content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/gallery", "/store", "/custom", "/contact", "/privacy"];
  const staticRoutes = pages.map((p) => ({
    url: `${site.url}${p}`,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.7,
  }));

  const productRoutes = getProducts().map((p) => ({
    url: `${site.url}/store/${p.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes];
}
