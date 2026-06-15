import type { Product } from "@/lib/types";

/**
 * THE STORE — knives currently available to buy.
 *
 * To add a knife:
 *  1. Add its photo. Best results: shoot on a plain, dark, uncluttered surface,
 *     then run `npm run bg-remove` to get a transparent PNG in
 *     /public/images/knives. (Or drop a ready image straight into /public/images.)
 *  2. Copy one of the blocks below, change the details, give it a unique `slug`
 *     (lowercase-with-hyphens), and point `images` at your file.
 *  3. Set `inStock: false` once it sells (keeps it visible as "Sold").
 *
 * Prices are NOT shown on the site — buyers enquire for a price. The specs
 * below are best-guess placeholders; update them with Nicky's real details.
 */
export const products: Product[] = [
  {
    slug: "horn-handled-hunter",
    name: "Horn-Handled Hunter",
    tagline: "Mirror-polished drop point with a sheep-horn handle.",
    description:
      "A classic drop-point hunter with a mirror-finished blade and a striking sheep-horn handle set off by a hardwood spacer and polished bolster. Comes with a fitted leather sheath. A real eye-catcher that still earns its keep in the field.",
    inStock: true,
    images: ["/images/knives/hunter-horn.png"],
    category: "Hunting",
    specs: [
      { label: "Overall length", value: "≈ 215 mm" },
      { label: "Blade length", value: "≈ 95 mm" },
      { label: "Steel", value: "N690 stainless" },
      { label: "Handle", value: "Sheep horn & hardwood" },
      { label: "Sheath", value: "Hand-stitched leather" },
    ],
  },
  {
    slug: "bushveld-chef",
    name: "Bushveld Chef Knife",
    tagline: "A hand-made kitchen knife with a hardwood handle.",
    description:
      "A lightweight, sharp kitchen knife with a long, thin blade and a comfortable hardwood handle. Balanced for everyday prep and supplied with a leather blade-guard. Equally at home in the kitchen or the camp.",
    inStock: true,
    images: ["/images/knives/kitchen-chef.png"],
    category: "Kitchen",
    specs: [
      { label: "Overall length", value: "≈ 300 mm" },
      { label: "Blade length", value: "≈ 180 mm" },
      { label: "Steel", value: "N690 stainless" },
      { label: "Handle", value: "Hardwood" },
      { label: "Sheath", value: "Leather blade-guard" },
    ],
  },
  {
    slug: "forged-bowie",
    name: "Forged Bowie",
    tagline: "Hammer-finished forged blade with a brass guard.",
    description:
      "A hand-forged bowie with a rugged hammered finish, a solid brass guard and a figured hardwood handle. A proper using-and-collecting knife with real presence, paired with a press-stud leather sheath.",
    inStock: true,
    images: ["/images/knives/bowie-forged.png"],
    category: "Bowie",
    specs: [
      { label: "Overall length", value: "≈ 280 mm" },
      { label: "Blade length", value: "≈ 150 mm" },
      { label: "Steel", value: "Forged carbon steel" },
      { label: "Guard", value: "Brass" },
      { label: "Handle", value: "Figured hardwood" },
      { label: "Sheath", value: "Hand-stitched leather" },
    ],
  },
  {
    slug: "red-g10-skinner",
    name: "Red G10 Skinner",
    tagline: "Compact skinner with a bold layered-G10 handle.",
    description:
      "A small, sharp skinner with a hard-wearing red, black and grey layered-G10 handle — tough, grippy and weatherproof. Carried in a horizontal cross-draw leather sheath. A neat everyday companion.",
    inStock: true,
    images: ["/images/knives/edc-red-g10.png"],
    category: "Skinner",
    specs: [
      { label: "Overall length", value: "≈ 190 mm" },
      { label: "Blade length", value: "≈ 80 mm" },
      { label: "Steel", value: "N690 stainless" },
      { label: "Handle", value: "Layered G10" },
      { label: "Sheath", value: "Leather (cross-draw)" },
    ],
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
