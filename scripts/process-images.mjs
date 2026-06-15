/**
 * Automatic background removal for uploaded knife photos.
 *
 * Runs as the `prebuild` step, so it happens on every build — including the
 * GitHub Actions deploy that fires when Nicky uploads a photo through the CMS.
 *
 * For each image in public/images/uploads/, it writes a transparent-background
 * PNG to public/images/processed/<name>.png. The site references the processed
 * version, so uploaded photos appear "cut out" automatically.
 *
 * - Idempotent: a hash manifest skips images that haven't changed.
 * - Resilient: if cut-out fails for an image, it falls back to the original
 *   (converted to PNG) so the build never breaks and something always shows.
 */
import { removeBackground } from "@imgly/background-removal-node";
import { readdir, mkdir, writeFile } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SRC_DIR = path.join(ROOT, "public", "images", "uploads");
const OUT_DIR = path.join(ROOT, "public", "images", "processed");
const MANIFEST = path.join(OUT_DIR, "manifest.json");
const IMG = /\.(jpe?g|png|webp)$/i;

const sha1 = (buf) => crypto.createHash("sha1").update(buf).digest("hex");

async function main() {
  if (!existsSync(SRC_DIR)) {
    console.log("[process-images] no uploads folder — nothing to do");
    return;
  }
  await mkdir(OUT_DIR, { recursive: true });

  const manifest = existsSync(MANIFEST)
    ? JSON.parse(readFileSync(MANIFEST, "utf8"))
    : {};
  const next = {};

  const files = (await readdir(SRC_DIR)).filter((f) => IMG.test(f)).sort();
  let processed = 0;
  let skipped = 0;

  for (const file of files) {
    const srcPath = path.join(SRC_DIR, file);
    const outName = file.replace(IMG, ".png");
    const outPath = path.join(OUT_DIR, outName);
    const hash = sha1(readFileSync(srcPath));
    next[outName] = hash;

    if (manifest[outName] === hash && existsSync(outPath)) {
      skipped++;
      continue;
    }

    process.stdout.write(`[process-images] ${file} -> processed/${outName} … `);
    try {
      const blob = await removeBackground(pathToFileURL(srcPath), {
        output: { format: "image/png" },
      });
      await writeFile(outPath, Buffer.from(await blob.arrayBuffer()));
      console.log("cut out");
    } catch (err) {
      // Fallback: keep the original (as PNG) so the image still appears.
      const sharp = (await import("sharp")).default;
      await sharp(srcPath).png().toFile(outPath);
      console.log(`kept original (cut-out failed: ${err?.message || err})`);
    }
    processed++;
  }

  await writeFile(MANIFEST, JSON.stringify(next, null, 2) + "\n");
  console.log(`[process-images] done — ${processed} processed, ${skipped} unchanged`);
}

main().catch((err) => {
  console.error("[process-images] fatal:", err);
  process.exit(1);
});
