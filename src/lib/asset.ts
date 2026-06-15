/**
 * Prefix a path to a file in /public with the deployment base path.
 *
 * `next/image` with `unoptimized: true` (required for static export) does NOT
 * automatically apply `basePath`, so image sources must be prefixed by hand or
 * they 404 when the site is served from a sub-path like /Nicky_B/. Internal
 * `<Link>` navigation is handled by Next automatically and does not use this.
 *
 * Usage: <Image src={asset("/images/foo.jpg")} ... />
 */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function asset(path: string): string {
  if (/^(https?:)?\/\//.test(path) || path.startsWith("data:")) return path;
  return `${BASE_PATH}${path.startsWith("/") ? "" : "/"}${path}`;
}
