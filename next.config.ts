import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimized for Vercel deployment
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
