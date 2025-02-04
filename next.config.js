/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://contentforge-be.onrender.com/api/:path*'
      }
    ]
  },
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
    serverActions: true,
  }
}

module.exports = nextConfig