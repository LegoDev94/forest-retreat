/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'videos.pexels.com' },
    ],
  },
  // Without middleware we still want /cottage/:id (no locale prefix) to work
  async redirects() {
    return [
      { source: '/cottage/:id', destination: '/ru/cottage/:id', permanent: false },
    ];
  },
};

export default nextConfig;
