import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    domains: [
      "res.cloudinary.com",
      "lh3.googleusercontent.com",
      "avatars.githubusercontent.com",
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
      bodySizeLimit: "50mb",
    },
  },
  serverExternalPackages: ["pusher"],
};

export default withNextIntl(nextConfig);
