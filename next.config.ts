import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
        hostname: "motobitesbackend.staging-api.motopayng.com",
      },
    ],
  },
};

export default nextConfig;
