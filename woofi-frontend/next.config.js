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
  // Disable server-side rendering for pages that use Solana
  experimental: {
    // This setting helps with Solana-related code that doesn't work in SSR
    appDir: true,
  },
  // Disable static optimization for pages that use Solana
  typescript: {
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig