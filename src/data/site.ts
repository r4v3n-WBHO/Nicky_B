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
  // Event-updates newsletter. Paste the form POST URL from your email provider's
  // embedded-form code to switch the signup on (footer + welcome popup); leave ""
  // to keep it hidden. Free options: MailerLite (recommended) or Brevo.
  //   MailerLite: https://assets.mailerlite.com/jsonp/<account>/forms/<id>/subscribe
  //   Brevo:      https://<subdomain>.sibforms.com/serve/<id>
  newsletter: {
    actionUrl: "",
    // Field names the provider expects for the email + optional first name:
    //   MailerLite → email "fields[email]", name "fields[name]"
    //   Brevo      → email "EMAIL",         name "FNAME"   (set name to "" to skip)
    emailField: "fields[email]",
    nameField: "fields[name]",
    // Rare: extra hidden inputs a provider's form needs, e.g. { "ml-submit": "1" }.
    hiddenFields: {} as Record<string, string>,
  },
};

export type Site = typeof site;
