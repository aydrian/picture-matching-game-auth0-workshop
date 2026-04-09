/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['*.app.github.dev'],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
