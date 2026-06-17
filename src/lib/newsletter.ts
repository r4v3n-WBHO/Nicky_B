import { site } from "@/data/site";
import { formConfigured } from "@/lib/submitInquiry";

/**
 * The newsletter signup (footer block + welcome popup) appears only when it's
 * switched on AND the email path is configured. A signup emails the address to
 * Nicky via FormSubmit — the same path as the contact form.
 */
export const newsletterConfigured = site.newsletterSignup && formConfigured;
