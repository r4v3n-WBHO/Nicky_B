/**
 * Build a white, transparent-background version of the logo for the dark header.
 *
 * The source logo is black line-art on a cream/white background. We convert
 * darkness -> opacity (black text becomes opaque, the background becomes
 * transparent) and recolour everything white, with a contrast ramp so the
 * off-white background drops out cleanly while letter edges stay smooth.
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

function clamp(v, min, max) {
  return v < min ? min : v > max ? max : v;
}

const { data, info } = await sharp(SRC)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
const out = Buffer.alloc(width * height * 4);

for (let i = 0, j = 0; i < data.length; i += channels, j += 4) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  // Map luminance through the ramp to an alpha value.
  const t = clamp((HI - lum) / (HI - LO), 0, 1);
  const alpha = Math.round(t * 255);
  out[j] = 255; // R
  out[j + 1] = 255; // G
  out[j + 2] = 255; // B
  out[j + 3] = alpha;
}

await sharp(out, { raw: { width, height, channels: 4 } })
  .png()
  .trim() // crop away fully-transparent margins so it sizes nicely in the header
  .toFile(OUT);

console.log(`Wrote ${path.relative(ROOT, OUT)} (${width}x${height} source)`);
