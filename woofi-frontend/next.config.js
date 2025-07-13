/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'placedog.net', 'placekitten.com'],
    unoptimized: true,
  },
  // Ensure compatibility with Vercel deployment
  swcMinify: true,
  output: 'standalone',
}

module.exports = nextConfig