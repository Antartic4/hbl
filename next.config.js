/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
  },
  reactStrictMode: true,
  images: { domains: ['res.cloudinary.com'] },
  swcMinify: true,
};

module.exports = nextConfig;
