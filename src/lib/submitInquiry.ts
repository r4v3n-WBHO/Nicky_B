import { site } from "@/data/site";

export type InquiryKind = "contact" | "custom-order";

export type InquiryInput = {
  kind: InquiryKind;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  details?: Record<string, string | number | undefined>;
};

export type InquiryResult =
  | { ok: true; delivered: boolean }
  | { ok: false; error: string };

/**
 * Public access key for Web3Forms (https://web3forms.com) — a free service that
 * turns a static form into an email, no backend required. It's baked in at
 * build time from the NEXT_PUBLIC_WEB3FORMS_KEY environment variable / GitHub
 * secret. Being public is fine — that's how Web3Forms is designed.
 */
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

/** True when the contact form has been wired up to deliver email. */
export const formConfigured = Boolean(WEB3FORMS_KEY);

export async function submitInquiry(input: InquiryInput): Promise<InquiryResult> {
  if (!input.email && !input.phone) {
    return { ok: false, error: "Please provide an email address or phone number." };
  }

  if (!WEB3FORMS_KEY) {
    return {
      ok: false,
      error: `The online form isn't set up yet — please call Nicky on ${site.phone}.`,
    };
  }

  const subject =
    input.kind === "custom-order"
      ? `New custom knife order — ${input.name || "website visitor"}`
      : `New website enquiry — ${input.name || "website visitor"}`;

  // Web3Forms emails every field it receives, so flatten the custom-order
  // selections into top-level fields with readable labels.
  const fields: Record<string, string> = {
    access_key: WEB3FORMS_KEY,
    subject,
    from_name: input.name || "Website visitor",
    Name: input.name || "",
    Email: input.email || "",
    Phone: input.phone || "",
    Message: input.message || "",
  };
  if (input.email) fields.replyto = input.email;
  if (input.details) {
    for (const [k, v] of Object.entries(input.details)) {
      if (v !== undefined && v !== null && v !== "") fields[k] = String(v);
    }
  }

  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(fields),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data?.success) {
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
