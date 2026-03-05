const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'placehold.co', 'vznnvarjmskohfamuvsn.supabase.co'],
  },
}

module.exports = withNextIntl(nextConfig);