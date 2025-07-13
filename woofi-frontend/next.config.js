/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'placedog.net',
      },
      {
        protocol: 'https',
        hostname: 'placekitten.com',
      },
    ],
    unoptimized: true,
  },
  // Ensure compatibility with Vercel deployment
  swcMinify: true,
}

module.exports = nextConfig