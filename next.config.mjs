/** @type {import('next').NextConfig} */
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./dev.db';
}

const nextConfig = {
  env: {
    DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db',
    JWT_SECRET: process.env.JWT_SECRET || 'feather-haven-super-secret-jwt-key-2026',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'feather-haven-super-secret-jwt-key-2026',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://feather-havenbyash.onrender.com',
  },
  optimizeFonts: false,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
