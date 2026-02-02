import type { NextConfig } from "next";

// Borramos el ": NextConfig" de aquí abajo
const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ensure Turbopack uses this folder as the workspace root to avoid
  // resolving files from the parent workspace (multiple lockfiles).
  // Next may warn if the workspace root is inferred incorrectly.
  // This property is tolerated by Next even if not present in the typed definition.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;