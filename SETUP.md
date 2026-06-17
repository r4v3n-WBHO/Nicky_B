# Go-live checklist

Tick these off to take the site from "built" to "fully live". Most of the
content items are done in the CMS (no code) — see the **Managing content**
section of `README.md`.

## 1. Get it online (one-time, required)
- [ ] Push the repo to GitHub (done if you're reading this there).
- [ ] **Settings → Pages → Build and deployment → Source = "GitHub Actions"**.
- [ ] Confirm the Actions run is green, then open
      `https://r4v3n-wbho.github.io/Nicky_B/`.

## 2. Make the forms send email (required for the email path)
- [ ] Decide the inbox for enquiries (Nicky's email).
- [ ] *(Recommended)* get a FormSubmit **alias** so the address isn't exposed
      (see README → "Receiving enquiries").
- [ ] Add a repo secret **`FORMSUBMIT_ID`** (Settings → Secrets and variables →
      Actions) with the alias/email.
- [ ] Re-deploy, then do **one real test submission with a photo** and confirm
      it arrives (first send triggers a one-time FormSubmit activation email).
- [ ] *(WhatsApp already works out of the box — no setup.)*

## 3. Connect the CMS (so Nicky can edit everything)
- [ ] Nicky needs a free **GitHub account** with access to the repo.
- [ ] Go to **app.pagescms.org**, sign in with GitHub, authorise the `Nicky_B`
      repo. The editor appears automatically.

## 4. Real content (all editable in the CMS)
- [ ] **About Nicky**: his real story + a photo of him.
- [ ] **Knives (Store)**: real specs, mark sold items, add/remove pieces.
- [ ] **Gallery**: his best past work.
- [ ] **Categories**: adjust to how he likes to group his knives.
- [ ] **Next event**: real show/market details (or switch the banner off).
- [ ] **Shop info**: confirm lead time, guarantee wording, payments.
- [ ] **Contact details**: add Nicky's email + Facebook/Instagram in
      `src/data/site.ts` (these aren't in the CMS yet).

## 5. Photos
- [ ] Re-shoot the 4 knives that don't cut out cleanly (karambits + a few
      skinners) on a plain background — see `PHOTO-GUIDE.md`.

## 6. Nice-to-haves
- [ ] **Custom domain** (e.g. `nickybknives.co.za`): add under Settings → Pages
      → Custom domain, then set `url` in `src/data/site.ts` and
      `NEXT_PUBLIC_BASE_PATH` to empty in the deploy workflow.
- [ ] **Analytics**: add repo secret `PLAUSIBLE_DOMAIN` (privacy-friendly visitor
      stats). Free options: Cloudflare Web Analytics or GoatCounter — see README.

## 7. Event newsletter (optional)
The footer signup and the one-time welcome popup stay hidden until a provider is
connected — so nothing shows until it actually works.
- [ ] Create a free account at **MailerLite** (recommended) or **Brevo**.
- [ ] Build a **signup form** there and turn on **double opt-in** (POPIA-friendly:
      the subscriber confirms by email).
- [ ] Copy the form's **POST URL** into `newsletter.actionUrl` in
      `src/data/site.ts` — the comments there show the MailerLite/Brevo URL
      formats and which field names to set.
- [ ] Commit / re-deploy. The signup now appears in the footer and as a gentle
      popup (shown once, then remembered).
- [ ] Do a **test signup** and confirm the address arrives in your provider and
      the confirmation email lands (the form submits silently, so a live test is
      how you verify it).
- [ ] Send event updates from the provider's dashboard whenever there's news.
