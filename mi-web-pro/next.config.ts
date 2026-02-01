import type { NextConfig } from "next";

// Borramos el ": NextConfig" de aquí abajo
const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;