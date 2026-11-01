import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The site is plain files on a CDN, so there is no server runtime.
  output: "export",
  // Project images are prepared by our own script at build time. The default optimiser
  // needs a server and is unsupported with a static export.
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
