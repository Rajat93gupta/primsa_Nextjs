import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // FakeStore (existing)
      {
        protocol: "https",
        hostname: "fakestoreapi.com",
        pathname: "/img/**",
      },

      // ✅ Cloudinary
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
