const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {}, // aktiviert Turbopack Build, verhindert Fehler bei Vercel
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname);
    return config;
  },
};

module.exports = nextConfig;

