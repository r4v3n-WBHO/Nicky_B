import { site } from "@/data/site";

export type InquiryKind = "contact" | "custom-order";

export type InquiryInput = {
  kind: InquiryKind;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  details?: Record<string, string | number | undefined>;
  /** Optional reference-photo attachments (custom-order form). */
  files?: File[];
};

export type InquiryResult =
  | { ok: true; delivered: boolean }
  | { ok: false; error: string };

/**
 * Forms are delivered by FormSubmit (https://formsubmit.co) — a free service
 * that turns a static form into an email and supports file attachments. The
 * endpoint id is Nicky's email, or (recommended) the random alias FormSubmit
 * gives you so the address isn't exposed in the page. Baked in at build time.
 */
const FORMSUBMIT_ID = process.env.NEXT_PUBLIC_FORMSUBMIT_ID;

/** True when the forms have been wired up to deliver email. */
export const formConfigured = Boolean(FORMSUBMIT_ID);

/** Total attachment size FormSubmit accepts (10 MB across all files). */
export const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;

export async function submitInquiry(input: InquiryInput): Promise<InquiryResult> {
  if (!input.email && !input.phone) {
    return { ok: false, error: "Please provide an email address or phone number." };
  }

  if (!FORMSUBMIT_ID) {
    return {
      ok: false,
      error: `The online form isn't set up yet — please call Nicky on ${site.phone}.`,
    };
  }

  const files = input.files ?? [];
  const totalBytes = files.reduce((n, f) => n + f.size, 0);
  if (totalBytes > MAX_ATTACHMENT_BYTES) {
    return { ok: false, error: "Photos are too large — keep the total under 10 MB." };
  }

  const subject =
    input.kind === "custom-order"
      ? `New custom knife order — ${input.name || "website visitor"}`
      : `New website enquiry — ${input.name || "website visitor"}`;

  const form = new FormData();
  form.append("_subject", subject);
  form.append("_captcha", "false");
  form.append("_template", "table");
  form.append("Name", input.name || "");
  form.append("Email", input.email || "");
  form.append("Phone", input.phone || "");
  form.append("Message", input.message || "");
  if (input.email) form.append("_replyto", input.email);
  if (input.details) {
    for (const [k, v] of Object.entries(input.details)) {
      if (v !== undefined && v !== null && v !== "") form.append(k, String(v));
    }
  }
  files.forEach((file, i) => form.append(`Reference photo ${i + 1}`, file, file.name));

  try {
    // Note: do NOT set Content-Type — the browser adds the multipart boundary.
    const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(FORMSUBMIT_ID)}`, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: form,
    });
    const data = await res.json().catch(() => ({}));
    const ok = res.ok && (data?.success === true || data?.success === "true");
    if (!ok) {
      return {
        ok: false,
        error: data?.message || `Couldn't send your message. Please call ${site.phone}.`,
      };
    }
    return { ok: true, delivered: true };
  } catch {
    return {
      ok: false,
      error: `Network error. Please try again, or call ${site.phone}.`,
    };
  }
}
