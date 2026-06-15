import type { CustomTemplate, CustomOption } from "@/lib/types";

/**
 * CUSTOM ORDER TEMPLATES — starting points a customer can pick and then tweak.
 * Selecting one pre-fills the builder; they can also start from scratch.
 */
export const templates: CustomTemplate[] = [
  {
    slug: "hunter",
    name: "Hunting Knife",
    description: "Drop-point or clip-point fixed blade built for the field.",
    image: "/images/uploads/hunter-horn.jpg",
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
    image: "/images/uploads/bowie-forged.jpg",
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
    image: "/images/uploads/kitchen-chef.jpg",
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
    image: "/images/uploads/skinner-red-g10.jpg",
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

/**
 * The choices offered in the custom-order builder. Add/remove options here
 * and the form updates automatically.
 */
export const customOptions: {
  bladeShape: CustomOption;
  steel: CustomOption;
  handleMaterial: CustomOption;
  sheath: CustomOption;
} = {
  bladeShape: {
    key: "bladeShape",
    label: "Blade shape",
    help: "The overall profile of the blade.",
    choices: [
      "Drop point",
      "Clip point",
      "Scandi grind",
      "Chef profile",
      "Tanto",
      "Skinner",
      "Not sure / Nicky's recommendation",
    ],
  },
  steel: {
    key: "steel",
    label: "Steel",
    help: "Stainless resists rust; carbon steels take a very keen edge.",
    choices: [
      "N690 stainless",
      "5160 carbon",
      "Damascus (pattern-welded)",
      "Not sure / Nicky's recommendation",
    ],
  },
  handleMaterial: {
    key: "handleMaterial",
    label: "Handle material",
    choices: [
      "Stabilised hardwood",
      "Stabilised burl",
      "Buffalo horn",
      "Micarta",
      "G10",
      "Not sure / Nicky's recommendation",
    ],
  },
  sheath: {
    key: "sheath",
    label: "Sheath",
    choices: [
      "Hand-stitched leather",
      "Kydex",
      "No sheath",
      "Not sure / Nicky's recommendation",
    ],
  },
};

export const bladeLengthRange = { min: 50, max: 300, step: 5, default: 110 };
