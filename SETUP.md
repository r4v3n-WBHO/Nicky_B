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
The footer signup + one-time welcome popup let visitors ask to hear about new
knives and shows. A signup **emails the address to Nicky** via FormSubmit (the
same path as the contact form) — he then adds them to however he sends updates.
- [ ] Make sure the email path works (section 2 — `FORMSUBMIT_ID`). The signup
      stays hidden until that's set.
- [ ] Nothing else to wire up — it then appears in the footer and as a gentle
      popup (shown once, then remembered). Set `newsletterSignup: false` in
      `src/data/site.ts` to hide it.
- [ ] To send an update, email your collected subscribers (BCC). If the list
      grows, move it into a free tool like MailerLite or Brevo.
