import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      canvas: { browser: "./src/lib/canvas-mock.ts" },
    },
  },
};

export default nextConfig;
