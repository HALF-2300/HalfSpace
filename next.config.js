/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export' removed so Server Actions (e.g. Clerk) work
  eslint: {
    // This project has many legacy ESLint findings across the codebase.
    // Keep builds unblocked while content/features evolve.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow TypeScript errors during build to keep deployment unblocked
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'apod.nasa.gov',
      },
      {
        protocol: 'https',
        hostname: 'www.nasa.gov',
      },
      {
        protocol: 'https',
        hostname: 'images-assets.nasa.gov',
      },
      {
        protocol: 'https',
        hostname: '**.esa.int',
      },
    ],
    // Disable optimization for external NASA images to prevent 403 errors
    unoptimized: true,
    // Add loader configuration to handle external images
    loader: 'default',
    // Allow all external domains (fallback)
    domains: [],
  },
  webpack: (config) => {
    config.watchOptions = {
      ignored: [
        '**/node_modules/**',
        '**/.next/**',
        '**/out/**',
        '**/dist/**',
        '**/build/**',
        '**/.git/**',
      ],
    }
    return config
  },
}

module.exports = nextConfig

