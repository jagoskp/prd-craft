import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  optimizeFonts: true,
  serverExternalPackages: ["@google/generative-ai"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;