import type { CustomTemplate } from "@/lib/types";

/**
 * CUSTOM ORDER TEMPLATES — starting points a customer can pick and then tweak.
 * Selecting one pre-fills the builder; they can also start from scratch.
 */
export const templates: CustomTemplate[] = [
  {
    slug: "hunter",
    name: "Hunting Knife",
    description: "Drop-point or clip-point fixed blade built for the field.",
    image: "/images/processed/hunter-horn.png",
    defaults: {
      bladeLengthMm: 115,
      bladeShape: "Drop point",
      steel: "N690 stainless",
      handleMaterial: "Stabilised hardwood",
    },
  },
  {
    slug: "bushcraft",
    name: "Bushcraft Knife",
    description: "Tough full-tang all-rounder for the outdoors.",
    image: "/images/processed/bowie-forged.png",
    defaults: {
      bladeLengthMm: 110,
      bladeShape: "Scandi grind",
      steel: "5160 carbon",
      handleMaterial: "Micarta",
    },
  },
  {
    slug: "chef",
    name: "Kitchen / Chef Knife",
    description: "Thin, sharp and balanced for the kitchen.",
    image: "/images/processed/kitchen-chef.png",
    defaults: {
      bladeLengthMm: 180,
      bladeShape: "Chef profile",
      steel: "N690 stainless",
      handleMaterial: "Stabilised burl",
    },
  },
  {
    slug: "edc",
    name: "Everyday Carry",
    description: "Compact fixed blade or slip-joint for daily use.",
    image: "/images/processed/skinner-red-g10.png",
    defaults: {
      bladeLengthMm: 75,
      bladeShape: "Drop point",
      steel: "N690 stainless",
      handleMaterial: "Micarta",
    },
  },
];

export function getTemplate(slug: string): CustomTemplate | undefined {
  return templates.find((t) => t.slug === slug);
}

// The blade-shape / steel / handle / sheath choices and the max blade length
// are managed in the CMS (content/custom.json) — see getCustomConfig().
