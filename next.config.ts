/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Permissive wildcards allow images from any secure web resource domain url
      },
    ],
  },
};

export default nextConfig;