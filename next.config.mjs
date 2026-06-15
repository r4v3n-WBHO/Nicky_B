/**
 * Configured for static export to GitHub Pages.
 *
 * - `output: "export"` produces a fully static site in `out/` (no server).
 * - `basePath` is set from NEXT_PUBLIC_BASE_PATH, which the GitHub Actions
 *   workflow fills in with "/<repo-name>" so links/assets resolve under
 *   https://<user>.github.io/<repo-name>/. Left empty for local dev.
 * - Images are unoptimized because the Next image optimizer needs a server.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  basePath: basePath || undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
