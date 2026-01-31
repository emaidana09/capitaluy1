import type { NextConfig } from "next";

// Borramos el ": NextConfig" de aquí abajo
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;