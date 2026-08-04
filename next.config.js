/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: __dirname,
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: process.env.PLATFORM_API_URL
          ? `${process.env.PLATFORM_API_URL}/:path*`
          : "https://hire-os-be.vercel.app/api/v1/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
