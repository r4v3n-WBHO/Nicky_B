import { site } from "@/data/site";

/**
 * Newsletter signup config (lives in src/data/site.ts). The footer block and
 * welcome popup only render once a provider form URL has been filled in, so the
 * site never shows a signup that goes nowhere.
 */
export const newsletter = site.newsletter;

/** True once a provider form URL is set — gates the footer block + popup. */
export const newsletterConfigured = Boolean(site.newsletter.actionUrl);
