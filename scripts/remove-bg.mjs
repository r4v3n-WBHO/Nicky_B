/**
 * One-time(ish) image processor: removes the background from the raw knife
 * photos and writes transparent PNGs to public/images/knives/.
 *
 * Usage:  npm run bg-remove
 *
 * Drop new JPGs into the source-photos/ folder (kept out of /public so the raw
 * photos aren't published) and either add them to the NAME_MAP below (for a
 * tidy filename) or just re-run — unmapped files use their original base name.
 *
 * Uses @imgly/background-removal-node (an ONNX segmentation model). The model
 * is downloaded and cached on first run.
 */
import { removeBackground } from "@imgly/background-removal-node";
import { readdir, mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SRC_DIR = path.join(ROOT, "source-photos");
const OUT_DIR = path.join(ROOT, "public", "images", "knives");

// Tidy, meaningful output names for the known photos.
const NAME_MAP = {
  "IMG-20260615-WA0000.jpg": "skinner-olive-guthook",
  "IMG-20260615-WA0001.jpg": "skinner-figured-wood",
  "IMG-20260615-WA0002.jpg": "edc-red-g10",
  "IMG-20260615-WA0003.jpg": "hunter-horn",
  "IMG-20260615-WA0004.jpg": "kitchen-chef",
  "IMG-20260615-WA0005.jpg": "skinner-walnut",
  // WA0006 is the brand sign / payment sticker — not a knife, skip it.
  "IMG-20260615-WA0007.jpg": "skinners-pair",
  "IMG-20260615-WA0008.jpg": "hunters-pair",
  "IMG-20260615-WA0009.jpg": "karambits",
  "IMG-20260615-WA0010.jpg": "sgian-dubh-celtic",
  "IMG-20260615-WA0011.jpg": "dirk-horn",
  "IMG-20260615-WA0012.jpg": "bowie-forged",
};

const SKIP = new Set(["IMG-20260615-WA0006.jpg"]);

async function main() {
  if (!existsSync(SRC_DIR)) {
    console.error(`Source folder not found: ${SRC_DIR}`);
    process.exit(1);
  }
  await mkdir(OUT_DIR, { recursive: true });

  const files = (await readdir(SRC_DIR)).filter((f) => /\.(jpe?g|png)$/i.test(f)).sort();
  console.log(`Found ${files.length} image(s). Processing…\n`);

  for (const file of files) {
    if (SKIP.has(file)) {
      console.log(`• ${file} — skipped`);
      continue;
    }
    const base = NAME_MAP[file] || file.replace(/\.[^.]+$/, "");
    const outPath = path.join(OUT_DIR, `${base}.png`);
    const srcUrl = pathToFileURL(path.join(SRC_DIR, file));

    process.stdout.write(`• ${file} → knives/${base}.png … `);
    try {
      const blob = await removeBackground(srcUrl, {
        output: { format: "image/png" },
      });
      const buffer = Buffer.from(await blob.arrayBuffer());
      await writeFile(outPath, buffer);
      console.log(`done (${Math.round(buffer.length / 1024)} KB)`);
    } catch (err) {
      console.log("FAILED");
      console.error(`   ${err?.message || err}`);
    }
  }

  console.log("\nFinished. Transparent PNGs are in public/images/knives/.");
}

main();
