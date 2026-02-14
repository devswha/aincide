import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  serverExternalPackages: [
    // Prevent bundling libsql native bindings / dynamic requires into server chunks.
    // These packages are traced and shipped via output-file-tracing instead.
    "@prisma/adapter-libsql",
    "@libsql/client",
    "libsql",
  ],
  experimental: {
    webpackBuildWorker: false,
  },
  webpack: (config) => {
    // Some dependencies (libsql/prisma adapter) contain dynamic requires that cause
    // Webpack to pull in README/LICENSE files. Treat them as source assets so the
    // build doesn't fail trying to parse them as JS.
    config.module?.rules?.push({
      test: /(README\.md|LICENSE)$/i,
      type: "asset/source",
    })
    return config
  },
};

export default nextConfig;
