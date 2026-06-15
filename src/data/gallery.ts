import type { GalleryItem } from "@/lib/types";

/**
 * THE WORK — a showcase of past and notable pieces (not necessarily for sale).
 *
 * To add a piece: add a photo (run `npm run bg-remove` for a clean transparent
 * PNG) and copy a block below.
 */
export const gallery: GalleryItem[] = [
  {
    slug: "copper-bone-skinners",
    title: "Copper & Bone Skinners",
    image: "/images/knives/skinners-pair.png",
    caption:
      "A matched pair of skinners — one in hardwood with a copper bolster, the other in bone with brass.",
  },
  {
    slug: "matched-hunters",
    title: "Matched Hunters",
    image: "/images/knives/hunters-pair.png",
    caption:
      "Two drop-point hunters finished side by side — hardwood and bone handles with polished bolsters.",
  },
  {
    slug: "celtic-sgian-dubh",
    title: "Celtic Sgian Dubh",
    image: "/images/knives/sgian-dubh-celtic.png",
    caption:
      "An ornate Scottish sgian dubh with Celtic knotwork fittings and a gemstone pommel. Commissioned piece (sold).",
  },
  {
    slug: "horn-dirk",
    title: "Horn-Handled Dirk",
    image: "/images/knives/dirk-horn.png",
    caption:
      "A Scottish-style dirk with a dark horn handle, silver fittings and a matching scabbard.",
  },
];
