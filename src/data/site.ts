/**
 * Central place for business / contact details. Edit these and the whole
 * site updates. No code knowledge needed beyond the quotes.
 */
export const site = {
  name: "Handmade Knives by Nicky Badenhorst",
  shortName: "Nicky B Knives",
  tagline: "Handmade knives, made one at a time.",
  description:
    "Custom, hand-made knives by Nicky Badenhorst. Hunting, bushcraft, kitchen and collector blades — shaped and finished by hand in South Africa.",
  // Full public address of the site (used for SEO: sitemap, social previews).
  // Update this if you move to a custom domain, e.g. "https://nickybknives.co.za".
  url: "https://r4v3n-wbho.github.io/Nicky_B",
  phone: "083 326 7141",
  // tel: link version (international format, no spaces)
  phoneHref: "+27833267141",
  // Leave blank until Nicky confirms an email address.
  email: "",
  location: "South Africa",
  // Optional social links — leave blank to hide.
  socials: {
    facebook: "",
    instagram: "",
    whatsapp: "https://wa.me/27833267141",
  },
};

export type Site = typeof site;
