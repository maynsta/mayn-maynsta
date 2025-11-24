/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // aktiviert striktes React-Verhalten
  swcMinify: true,       // schnelleres Minifying mit SWC
  typescript: {
    // Baut auch wenn es TypeScript-Fehler gibt, aber nur als letzte Option
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true, // falls du externe Bilder ohne Optimierung nutzt
  },
  experimental: {
    appDir: true,      // falls du das neue /app-Verzeichnis nutzt
  },
  env: {
    // Optional: lokale Env-Variablen, falls nicht über Vercel gesetzt
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
};

export default nextConfig;
