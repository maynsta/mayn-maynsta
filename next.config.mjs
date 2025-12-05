/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: true },
  turbopack: { enabled: false } // Turbopack deaktivieren, Webpack nutzen
}

export default nextConfig
