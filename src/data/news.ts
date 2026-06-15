/**
 * NEXT EVENT — the news banner shown at the top of the home page.
 *
 * Edit the fields below before each show. To hide the banner entirely (e.g.
 * when there's no upcoming event), set `active: false`.
 *
 * ⚠️ The details below are PLACEHOLDERS — replace them with Nicky's real next
 * event (markets, knife shows, expos, etc.).
 */
export type NextEvent = {
  active: boolean;
  /** Small kicker above the title, e.g. "Next event" or "Catch me at" */
  kicker: string;
  title: string;
  /** Human-readable date or range, e.g. "12–14 September 2026" */
  date: string;
  location: string;
  /** Optional extra line of detail */
  blurb?: string;
  /** Optional button, e.g. a maps link or event page */
  link?: { label: string; href: string };
};

export const nextEvent: NextEvent = {
  active: true,
  kicker: "Next event",
  title: "Find Nicky at the Bushveld Knife & Outdoor Show",
  date: "12–14 September 2026",
  location: "Pretoria — Hall 2, Stand 14",
  blurb: "Come see the latest knives in person, handle the range, and chat custom orders.",
  link: { label: "Get directions", href: "https://maps.google.com" },
};
