import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const csp = isDev
  ? `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:;
      worker-src 'self' blob:;
      child-src 'self' blob:;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: blob: https://*.b-cdn.net https://i.pinimg.com;
      media-src 'self' blob: https://*.b-cdn.net;
      font-src 'self' data:;
      connect-src 'self' ws: wss: http://localhost:* https://*.b-cdn.net https:;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
    `
      .replace(/\n/g, "")
      .replace(/\s{2,}/g, " ")
      .trim()
  : `
      default-src 'self';
      script-src 'self' 'unsafe-inline' blob:;
      worker-src 'self' blob:;
      child-src 'self' blob:;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: blob: https://*.b-cdn.net https://i.pinimg.com;
      media-src 'self' blob: data: https://*.b-cdn.net;
      font-src 'self' data:;
      connect-src 'self' blob: https://*.b-cdn.net https://*.storage.bunnycdn.com;
      object-src 'none';
      frame-ancestors 'none';
      base-uri 'self';
      form-action 'self';
      upgrade-insecure-requests;
    `
      .replace(/\n/g, "")
      .replace(/\s{2,}/g, " ")
      .trim();

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: csp,
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
  {
    key: "Cross-Origin-Resource-Policy",
    value: "same-site",
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.b-cdn.net",
      },
      {
        protocol: "https",
        hostname: "i.pinimg.com",
      },
    ],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "2gb",
    },
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;