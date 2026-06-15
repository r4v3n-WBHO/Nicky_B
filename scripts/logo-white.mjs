/**
 * Build a white, transparent-background version of the logo for the dark header.
 *
 * Steps:
 *  1. Detect and crop off the bottom band (the phone number) so the header logo
 *     is just the "Handmade Knives by Nicky Badenhorst" mark.
 *  2. Convert darkness -> opacity (black line-art becomes opaque, the cream
 *     background becomes transparent) and recolour everything white, with a
 *     contrast ramp so the background drops out while edges stay smooth.
 *  3. Trim the transparent margins.
 *
 * Usage: npm run logo-white
 */
import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "public", "nicky_b_logo.jpg");
const OUT = path.join(ROOT, "public", "nicky_b_logo_white.png");

// Alpha ramp: luminance at/below LO -> fully opaque, at/above HI -> transparent.
const LO = 45;
const HI = 175;
const INK = 110; // pixels darker than this count as "ink"

const clamp = (v, min, max) => (v < min ? min : v > max ? max : v);

// --- 1. Find the bottom text band (the phone number) and crop above it -------
const gray = await sharp(SRC).greyscale().raw().toBuffer({ resolveWithObject: true });
const { width, height } = gray.info;
const minInk = Math.max(2, Math.floor(width * 0.02));

const rowHasInk = [];
for (let y = 0; y < height; y++) {
  let count = 0;
  for (let x = 0; x < width; x++) if (gray.data[y * width + x] < INK) count++;
  rowHasInk.push(count >= minInk);
}

// Group consecutive inked rows into bands.
const bands = [];
let start = -1;
for (let y = 0; y < height; y++) {
  if (rowHasInk[y] && start === -1) start = y;
  else if (!rowHasInk[y] && start !== -1) {
    bands.push([start, y - 1]);
    start = -1;
  }
}
if (start !== -1) bands.push([start, height - 1]);

let cropHeight = height;
if (bands.length >= 2) {
  const last = bands[bands.length - 1];
  const prev = bands[bands.length - 2];
  // Treat the last band as the number only if it sits in the bottom third.
  if (last[0] > height * 0.6) {
    cropHeight = Math.round((prev[1] + last[0]) / 2); // cut in the gap above it
  }
}
cropHeight = clamp(cropHeight, Math.round(height * 0.5), height);

// --- 2 & 3. Recolour to white-on-transparent, then trim ----------------------
const { data, info } = await sharp(SRC)
  .extract({ left: 0, top: 0, width, height: cropHeight })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const ch = info.channels;
const out = Buffer.alloc(info.width * info.height * 4);
for (let i = 0, j = 0; i < data.length; i += ch, j += 4) {
  const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  const t = clamp((HI - lum) / (HI - LO), 0, 1);
  out[j] = 255;
  out[j + 1] = 255;
  out[j + 2] = 255;
  out[j + 3] = Math.round(t * 255);
}

await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
  .png()
  .trim()
  .toFile(OUT);

console.log(
  `Wrote ${path.relative(ROOT, OUT)} — cropped ${height}px -> ${cropHeight}px (removed number band)`,
);
