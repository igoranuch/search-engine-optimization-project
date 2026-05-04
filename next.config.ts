import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Old /en/blog/... and /uk/blog/... routes no longer exist.
      // 301 passes link equity to the new URL and removes them from Google's index.
      {
        source: "/:locale(en|uk)/blog/:path*",
        destination: "/:locale/:path*",
        permanent: true,
      },
      // Bare /blog/... without locale prefix (edge case)
      {
        source: "/blog/:path*",
        destination: "/en/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
