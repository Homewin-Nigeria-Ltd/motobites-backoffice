import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "devmotopaymp.obs.af-south-1.myhuaweicloud.com",
      },
      {
        protocol: "https",
        hostname: "**.myhuaweicloud.com",
      },
      {
        protocol: "https",
        hostname: "motobitesbackend.staging-api.motopayng.com",
      },
    ],
  },
};

export default nextConfig;
