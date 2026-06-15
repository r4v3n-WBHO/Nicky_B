# Handmade Knives by Nicky Badenhorst — website

A website for Nicky's custom knife business: a gallery of his work, a store of
in-stock knives, and a custom-order builder where customers design a knife and
request a quote.

Built with **Next.js 14**, **TypeScript** and **Tailwind CSS**, exported as a
**static site** and hosted free on **GitHub Pages** (deployed automatically by
GitHub Actions on every push). No database — all content lives in editable
files in the repo, and orders/enquiries are emailed to Nicky via Web3Forms.

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

## Editing the content (no coding required)

All content lives in `src/data/`. Edit the file, save, and the site updates
(after a redeploy, or instantly in `npm run dev`).

| What you want to change | File |
| --- | --- |
| Phone, name, location, social links | `src/data/site.ts` |
| Knives **for sale** (the Store) | `src/data/products.ts` |
| Gallery of **past work** (The Work) | `src/data/gallery.ts` |
| Custom-order templates & options | `src/data/templates.ts` |
| **Next event** news banner (home page) | `src/data/news.ts` |

### Photos & background removal
The site shows knives as transparent PNGs "floating" on a dark background.

1. Put the original photo(s) in the **`source-photos/`** folder (this folder is
   kept out of `public/` so the large originals aren't published).
2. Run `npm run bg-remove`. This removes the background and writes a transparent
   PNG to `public/images/knives/`.
3. Reference the result in the data files as `/images/knives/<name>.png`.

> **Photo tip:** background removal works *far* better when the knife is shot on
> a plain, uncluttered surface (a dark cloth or a sheet of paper). Photos taken
> on wood, driftwood or patterned mats often don't cut out cleanly. A few of
> Nicky's originals (the karambits and a couple of skinners) need re-shooting on
> a plain backdrop before they'll look good — they're left out for now.

You can also skip the tool and just drop a ready-made image straight into
`public/images/` and reference it as `/images/yourfile.png`.

### Adding a knife to the store
Open `src/data/products.ts`, copy an existing block, and change the details.
- Give each knife a unique `slug` (lowercase-with-hyphens).
- Set `inStock: false` once it sells (it stays visible as "Sold").

### Adding a gallery piece
Same idea, in `src/data/gallery.ts`.

### Updating the "Next event" banner
Edit `src/data/news.ts` before each show (title, date, location). Set
`active: false` to hide the banner when there's no upcoming event.

---

## Receiving enquiries & custom orders by email

Because the site is static (no server), the contact form and custom-order
builder send submissions via [Web3Forms](https://web3forms.com) — a free
service that emails you each submission. No backend or domain setup required.

**Until this is configured, the forms show a "please call" message instead of
sending.** To turn it on:

1. Go to <https://web3forms.com>, enter Nicky's email address, and copy the
   **Access Key** it gives you.
2. In GitHub: **Settings → Secrets and variables → Actions → New repository
   secret**. Name it `WEB3FORMS_KEY`, paste the key, save.
3. Re-run the deploy (push any change, or use the Actions tab → "Run workflow").

For local testing, copy `.env.example` to `.env.local` and set
`NEXT_PUBLIC_WEB3FORMS_KEY` there.

> The access key is public by design (it ships inside the built site). It only
> allows sending to Nicky's verified inbox, so this is safe.

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
  components/           # Header, Footer, ProductCard, EventBanner, forms, builder
  data/                # ⬅ edit these to change content
  lib/                 # types & helpers
public/
  images/knives/       # transparent knife PNGs (shown on the site)
  nicky_b_logo.jpg     # logo
scripts/
  remove-bg.mjs        # `npm run bg-remove` — background removal
source-photos/         # original photos (NOT published; source for bg-remove)
```

---

## Notes & next steps

- **Payments:** intentionally not included — the store and custom orders are
  enquiry/quote based. A SA gateway (PayFast / Yoco) can be added later if Nicky
  wants real online checkout.
- **Real photos** will make the biggest difference — swap the placeholders as
  soon as they're available.
- Confirm Nicky's **email address** and any **social links**, then add them to
  `src/data/site.ts`.
```
