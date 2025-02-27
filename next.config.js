/** @type {import('next').NextConfig} */
const nextConfig = {
  //output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // Remove output: 'export' when deploying to a Node.js environment
  // The static export is not compatible with API routes
};

module.exports = nextConfig;