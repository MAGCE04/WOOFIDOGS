/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'placedog.net', 'placekitten.com'],
  },
}

module.exports = nextConfig