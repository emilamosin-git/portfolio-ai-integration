import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: false, // Prevents double-mount in dev from aborting streams
}

export default nextConfig
