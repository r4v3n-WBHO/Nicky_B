import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/**
 * Build-time content loader. Reads the editable files in /content (managed by
 * Pages CMS) and turns them into typed objects for the pages to render. This
 * only runs at build time during the static export — there is no runtime cost.
 */

const CONTENT_DIR = path.join(process.cwd(), "content");

/**
 * Knife photos are shown with their background removed. The `prebuild` step
 * (scripts/process-images.mjs) writes a transparent PNG for every uploaded
 * photo to /images/processed; this maps an uploaded path to that version.
 * Non-upload paths (or anything already processed) are returned unchanged.
 */
function cutOut(src: string): string {
  const m = src.match(/^\/images\/uploads\/(.+)\.(jpe?g|png|webp)$/i);
  return m ? `/images/processed/${m[1]}.png` : src;
}

export type ProductSpec = { label: string; value: string };

export type Product = {
  slug: string;
  name: string;
  category?: string;
  tagline?: string;
  description?: string;
  inStock: boolean;
  order: number;
  images: string[];
  specs: ProductSpec[];
};

export type GalleryItem = {
  slug: string;
  title: string;
  image: string;
  caption?: string;
  order: number;
};

export type Category = {
  slug: string;
  name: string;
  order: number;
};

export type EventNews = {
  active: boolean;
  kicker: string;
  title: string;
  date: string;
  location: string;
  blurb?: string;
  linkLabel?: string;
  linkHref?: string;
};

function readCollection(dir: string): Array<{ slug: string; data: Record<string, unknown> }> {
  const full = path.join(CONTENT_DIR, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(full, f), "utf8");
      const { data } = matter(raw);
      return { slug: f.replace(/\.md$/, ""), data };
    });
}

function readJson<T>(file: string, fallback: T): T {
  const full = path.join(CONTENT_DIR, file);
  if (!fs.existsSync(full)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(full, "utf8")) as T;
  } catch {
    return fallback;
  }
}

function byOrderThen(field: "name" | "title") {
  return (a: Record<string, unknown>, b: Record<string, unknown>) => {
    const ao = Number(a.order ?? 0);
    const bo = Number(b.order ?? 0);
    if (ao !== bo) return ao - bo;
    return String(a[field] ?? "").localeCompare(String(b[field] ?? ""));
  };
}

export function getProducts(): Product[] {
  return readCollection("products")
    .map(({ slug, data }) => ({
      slug,
      name: String(data.name ?? slug),
      category: data.category ? String(data.category) : undefined,
      tagline: data.tagline ? String(data.tagline) : undefined,
      description: data.description ? String(data.description) : undefined,
      inStock: data.inStock !== false,
      order: Number(data.order ?? 0),
      images: Array.isArray(data.images) ? (data.images as string[]).map(cutOut) : [],
      specs: Array.isArray(data.specs) ? (data.specs as ProductSpec[]) : [],
    }))
    .sort((a, b) => byOrderThen("name")(a, b));
}

export function getProduct(slug: string): Product | undefined {
  return getProducts().find((p) => p.slug === slug);
}

export function getGallery(): GalleryItem[] {
  return readCollection("gallery")
    .map(({ slug, data }) => ({
      slug,
      title: String(data.title ?? slug),
      image: cutOut(String(data.image ?? "")),
      caption: data.caption ? String(data.caption) : undefined,
      order: Number(data.order ?? 0),
    }))
    .filter((g) => g.image)
    .sort((a, b) => byOrderThen("title")(a, b));
}

export function getCategories(): Category[] {
  return readCollection("categories")
    .map(({ slug, data }) => ({
      slug,
      name: String(data.name ?? slug),
      order: Number(data.order ?? 0),
    }))
    .sort((a, b) => byOrderThen("name")(a, b));
}

export function getEvent(): EventNews {
  return readJson<EventNews>("event.json", {
    active: false,
    kicker: "Next event",
    title: "",
    date: "",
    location: "",
  });
}

export type About = {
  heading: string;
  image?: string;
  body: string;
};

export function getAbout(): About {
  return readJson<About>("about.json", { heading: "About", image: "", body: "" });
}

export type CustomConfig = {
  bladeShapes: string[];
  steels: string[];
  handleMaterials: string[];
  sheaths: string[];
  bladeLengthMaxMm: number;
};

const CUSTOM_DEFAULTS: CustomConfig = {
  bladeShapes: ["Drop point", "Clip point", "Scandi grind", "Not sure / Nicky's recommendation"],
  steels: ["N690 stainless", "5160 carbon", "Not sure / Nicky's recommendation"],
  handleMaterials: ["Stabilised hardwood", "Micarta", "Not sure / Nicky's recommendation"],
  sheaths: ["Hand-stitched leather", "Kydex", "No sheath"],
  bladeLengthMaxMm: 500,
};

export function getCustomConfig(): CustomConfig {
  const d = readJson<Partial<CustomConfig>>("custom.json", {});
  const list = (v: unknown, fallback: string[]) =>
    Array.isArray(v) && v.length ? (v as string[]) : fallback;
  return {
    bladeShapes: list(d.bladeShapes, CUSTOM_DEFAULTS.bladeShapes),
    steels: list(d.steels, CUSTOM_DEFAULTS.steels),
    handleMaterials: list(d.handleMaterials, CUSTOM_DEFAULTS.handleMaterials),
    sheaths: list(d.sheaths, CUSTOM_DEFAULTS.sheaths),
    bladeLengthMaxMm: Number(d.bladeLengthMaxMm) || CUSTOM_DEFAULTS.bladeLengthMaxMm,
  };
}
