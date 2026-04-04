import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["canvas"],
  turbopack: {
    resolveAlias: {
      canvas: "./src/lib/canvas-mock.ts",
    },
  },
  webpack: (config: any) => {
    // Prevent webpack from trying to bundle the native canvas node addon
    config.externals = [
      ...(Array.isArray(config.externals) ? config.externals : []),
      { canvas: "commonjs canvas" },
    ];
    return config;
  },
};

export default nextConfig;
