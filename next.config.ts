import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['basemaps.cartocdn.com', 'images.unsplash.com', 'randomuser.me'],
  },
  outputFileTracingRoot: __dirname,
  /* config options here */
};

export default nextConfig;
