/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // Enable recommended experimental features
    serverActions: true,
  },
  // Configure image domains if needed
  images: {
    domains: [],
  },
  // Fix for the QR scanner library
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-qr-scanner': 'react-qr-scanner/dist/index.js',
    };
    return config;
  },
  // Transpile modules with issues
  transpilePackages: ['react-qr-scanner'],
};

module.exports = nextConfig;