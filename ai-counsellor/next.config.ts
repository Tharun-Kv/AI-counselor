import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",                 // REQUIRED for GitHub Pages
  basePath: "/AI-counselor",         // repo name
  assetPrefix: "/AI-counselor/",
  images: {
    unoptimized: true,              // REQUIRED for Pages
  },
};

export default nextConfig;
