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
  // Allow legacy cottage paths from /content/...  (unencoded; already kebab-cased)
  async redirects() {
    return [
      // Old /cottage/:id (Vite SPA URL) → new locale-aware path
      { source: '/cottage/:id', destination: '/ru/cottage/:id', permanent: true },
    ];
  },
};

export default nextConfig;
