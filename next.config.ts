import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Only enforce static export during production builds, so local dev respects dynamic routes
  ...(process.env.NODE_ENV === 'production' ? { output: "export" } : {}),
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Server actions are not supported in static export, so we comment this out
  // experimental: {
  //   serverActions: {
  //     bodySizeLimit: '50mb',
  //   },
  // },
};

export default nextConfig;
