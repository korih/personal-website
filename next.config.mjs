/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: "/reviews/movies",
        destination: "/reviews",
        permanent: true,
      },
      {
        source: "/reviews/light-novels",
        destination: "/reviews",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.r2.cloudflarestorage.com",
      },
      {
        protocol: "https",
        hostname: "*.r2.dev",
      },
      {
        protocol: "https",
        hostname: "media.korih.com",
      },
    ],
  },
};

export default nextConfig;
