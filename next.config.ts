import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.b-cdn.net",
      },{
         protocol: "https",
        hostname: "i.pinimg.com",
      }
    ],
  },
  experimental :{
    serverActions :{
      bodySizeLimit : "2gb"
    }
  },
};

export default nextConfig;