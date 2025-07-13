/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'placedog.net', 'placekitten.com'],
    unoptimized: true,
  },
  // Ensure compatibility with Vercel deployment
  swcMinify: true,
  // Remove output setting to use default Vercel behavior
}

module.exports = nextConfig