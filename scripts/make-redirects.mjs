/**
 * Post-build: emit tiny redirect stub pages into the static export (out/) for
 * any old URLs listed in content/redirects.json.
 *
 * GitHub Pages has no server-side redirects, so when a page is renamed or
 * retired (e.g. a product slug changes) the old URL would 404. This writes a
 * client-side redirect (canonical + meta refresh + JS) at the old path so
 * shared/old links still land in the right place — and search engines fold the
 * old URL into the new one via the canonical.
 *
 * Runs as `postbuild`, after `next build` has written out/. Edit the mapping in
 * content/redirects.json — keys and values are site-relative paths ("/from" ->
 * "/to"); the base path is added automatically for the deployed target.
 */
import { readFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "out");
const REDIRECTS = path.join(ROOT, "content", "redirects.json");
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

function stub(target) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="robots" content="noindex">
<title>Page moved</title>
<link rel="canonical" href="${target}">
<meta http-equiv="refresh" content="0; url=${target}">
<script>location.replace(${JSON.stringify(target)})</script>
</head>
<body>
<p>This page has moved. <a href="${target}">Continue &rarr;</a></p>
</body>
</html>
`;
}

function main() {
  if (!existsSync(OUT)) {
    console.log("[redirects] no out/ folder — run after `next build`");
    return;
  }
  if (!existsSync(REDIRECTS)) {
    console.log("[redirects] no content/redirects.json — nothing to do");
    return;
  }

  const map = JSON.parse(readFileSync(REDIRECTS, "utf8"));
  let n = 0;
  for (const [from, to] of Object.entries(map)) {
    if (!from.startsWith("/") || typeof to !== "string" || !to.startsWith("/")) {
      console.warn(`[redirects] skipping "${from}" -> "${to}" (paths must start with /)`);
      continue;
    }
    // out/ is the deploy root, so the stub's folder is base-path-less; the
    // browser-facing target, however, must include the base path.
    const dir = path.join(OUT, ...from.replace(/(^\/+|\/+$)/g, "").split("/"));
    mkdirSync(dir, { recursive: true });
    const target = `${BASE}${to.endsWith("/") ? to : to + "/"}`;
    writeFileSync(path.join(dir, "index.html"), stub(target));
    console.log(`[redirects] ${from} -> ${target}`);
    n++;
  }
  console.log(`[redirects] wrote ${n} redirect stub(s)`);
}

main();
