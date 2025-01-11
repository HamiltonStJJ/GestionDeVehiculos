import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // appDir: true,
  },
  async headers() {
    return [
      {
        source: "/auth/change-password",
        headers: [
          {
            key: "cache-control",
            value: "no-store",
          },
        ],
      },
    ];
  },
  /* Otros ajustes opcionales aquí */
};

export default nextConfig;
