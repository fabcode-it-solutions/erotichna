import { createRequire } from 'module';

const require = createRequire(import.meta.url);


/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    domains: ["storage.bunnycdn.com", "files-erotichna.b-cdn.net"],
  },
};

export default nextConfig;
