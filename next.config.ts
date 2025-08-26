/** @type {import('next').NextConfig} */

import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5000/api/:path*",
      },
    ];
  },
  images: {
    domains: ['your-image-domain.com'],
  },
};

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

export default withNextIntl(nextConfig);
