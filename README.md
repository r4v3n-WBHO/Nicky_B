# Handmade Knives by Nicky Badenhorst — website

A website for Nicky's custom knife business: a gallery of his work, a store of
in-stock knives, and a custom-order builder where customers design a knife and
request a quote.

Built with **Next.js 14**, **TypeScript** and **Tailwind CSS**, exported as a
**static site** and hosted free on **GitHub Pages** (deployed automatically by
GitHub Actions on every push). No database — content is managed through a
friendly CMS (**Pages CMS**) that saves to this repo, and orders/enquiries are
emailed to Nicky via Web3Forms.

---

## Running it locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

To check the production static build locally:

```bash
npm run build        # outputs the static site to ./out
npx serve out        # preview at http://localhost:3000
```

> `npm start` is **not** used — this site is a static export, not a server.

---

## Managing content — the CMS (for Nicky, no coding)

Day-to-day content (knives, photos, categories, the next-event banner) is
managed through **[Pages CMS](https://pagescms.org)** — a free, friendly editor
that saves changes straight into this GitHub repo. Every save auto-publishes via
GitHub Actions, so the live site updates a minute or two later.

**One-time setup**
1. Make sure Nicky has a (free) **GitHub account** and that it has access to this
   repo (he's the owner, or add him under **Settings → Collaborators**).
2. Go to **<https://app.pagescms.org>** and **sign in with GitHub**.
3. Authorise it for the `Nicky_B` repository. That's it — the editor is defined
   by the `.pages.yml` file in this repo.

**What Nicky can do in the CMS**
| Section | What it does |
| --- | --- |
| **Knives for sale (Store)** | Add/edit/remove knives: name, category, tagline, description, photos, in-stock toggle, specs, order |
| **Gallery (past work)** | Add/edit showcase pieces with a photo + caption |
| **Categories** | Add/rename/reorder the categories that knives can be filed under (these become the store's filter buttons) |
| **Next event** | Update the home-page banner (title, date, location, blurb, button) or switch it off |
| **About Nicky** | The "why I make knives" section on the contact page — heading, photo of Nicky, and his story |
| **Custom order options** | The blade-shape, steel, handle-material and sheath choices in the custom-order builder, plus the max blade length |
| **Shop info** | Lead time, guarantee/returns wording, and accepted payments (shown on the store, product and custom pages) |

Photos uploaded in the CMS are stored in `public/images/uploads/`, and the
deploy build **automatically removes the background** (via
`scripts/process-images.mjs`, run as a `prebuild` step) so knives appear "cut
out" / floating on the site. The transparent versions are written to
`public/images/processed/`. (Nicky's About photo is left as-is — only knife
photos are cut out.)

> **Tip for clean cut-outs:** background removal works best when the knife is
> photographed on a plain, uncluttered surface in good light. Busy backgrounds
> (wood grain, patterned cloth) may not separate perfectly. If a cut-out ever
> looks wrong, the build safely falls back to showing the original photo.

### Editing content by hand (optional)
Everything the CMS edits is just files in the **`content/`** folder
(`content/products`, `content/gallery`, `content/categories`, `content/event.json`),
so you can also edit them directly and `git push`. The few things not in the CMS
live in code: contact details (`src/data/site.ts`) and the custom-order builder
options (`src/data/templates.ts`).

---

## Receiving enquiries & custom orders

Both the contact form and the custom-order builder offer **two ways to send**:

- **By email** (primary button) → delivered via [FormSubmit](https://formsubmit.co),
  a free service (no backend). This captures a record, and the custom-order form
  can include **reference-photo attachments** (up to 10 MB). Needs the one-time
  setup below.
- **On WhatsApp** (secondary button) → opens WhatsApp to Nicky pre-filled with
  the message / knife spec; the customer presses send (and can attach photos in
  the chat). Uses the number in `src/data/site.ts` — works immediately, no setup.

So WhatsApp works out of the box; set up FormSubmit below to enable the email
path too.

**Until this is configured, the forms show a "please call" message instead of
sending.** To turn it on:

1. Pick the inbox that should receive enquiries (Nicky's email).
2. *(Recommended, for privacy)* get a random **alias** so the address isn't
   exposed in the page: submit any FormSubmit form to that email once, confirm
   the activation email, then copy the alias string from FormSubmit.
3. In GitHub: **Settings → Secrets and variables → Actions → New repository
   secret**. Name it `FORMSUBMIT_ID`, paste the alias (or the raw email), save.
4. Re-run the deploy (push any change, or Actions tab → "Run workflow").
5. The **first** real submission triggers a one-time FormSubmit confirmation
   email — click to activate, then submissions flow through.

For local testing, copy `.env.example` to `.env.local` and set
`NEXT_PUBLIC_FORMSUBMIT_ID` there.

> Customers can also still WhatsApp photos to Nicky if they prefer.

---

## Deploying (free) to GitHub Pages

Deployment is automated by `.github/workflows/deploy.yml`.

**One-time setup:**

1. Push this repo to GitHub.
2. In the repo: **Settings → Pages → Build and deployment → Source** →
   choose **GitHub Actions**.
3. (Optional but recommended) Add the `WEB3FORMS_KEY` secret as described above
   so the forms work.

That's it. Every `git push` to `main` builds the site and publishes it to
`https://<your-username>.github.io/<repo-name>/`. You can also trigger a deploy
manually from the **Actions** tab.

The workflow automatically sets the URL base path to the repo name. If you
later add a **custom domain** (Settings → Pages → Custom domain) or rename the
repo to `<username>.github.io`, set `NEXT_PUBLIC_BASE_PATH` to an empty string
in the workflow's `env:` block.

---

## Project structure

```
src/
  app/                 # pages (Next.js App Router)
    page.tsx           # home
    gallery/           # The Work
    store/             # store list + [slug] product pages
    custom/            # custom-order builder
    contact/           # contact page
  components/           # Header, Footer, ProductCard, StoreBrowser, EventBanner, forms, builder
  data/                # site/contact details + custom-order builder options
  lib/                 # content loader (reads /content) + helpers
content/                # ⬅ CMS-managed content (edited via Pages CMS)
  products/            #    knives for sale (one .md per knife)
  gallery/             #    past-work pieces
  categories/          #    category list
  event.json           #    next-event banner
  about.json           #    "about Nicky" section
  custom.json          #    custom-order builder options
public/
  images/uploads/      # photos uploaded via the CMS (originals)
  images/processed/    # auto background-removed versions (generated at build)
  nicky_b_logo_white.png  # white logo used in the header
  nicky_b_logo.jpg     # original logo (source for `npm run logo-white`)
scripts/
  process-images.mjs   # prebuild: removes photo backgrounds
  logo-white.mjs       # `npm run logo-white` — regenerate the white logo
.pages.yml              # Pages CMS configuration (defines the editor)
```

---

## Notes & next steps

- **Payments:** intentionally not included — the store and custom orders are
  enquiry/quote based. Nicky already takes card payments in person via Yoco; a
  SA online gateway (Yoco / PayFast) can be added later if he wants checkout.
- **Specs & prices:** specs on the seeded knives are best-guess placeholders
  (prices aren't shown — buyers enquire). Nicky can correct the specs in the CMS.
- **Categories:** seeded with Hunting / Skinner / Kitchen / Bowie — Nicky can
  change these in the CMS to match how he likes to group his work.
- Confirm Nicky's **email address** and any **social links**, then add them to
  `src/data/site.ts` (these aren't in the CMS yet).
