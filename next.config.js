/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['mysql2', '@azure/storage-blob'],
  },
};

module.exports = nextConfig;