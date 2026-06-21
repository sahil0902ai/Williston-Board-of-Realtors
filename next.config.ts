import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  // @ts-ignore - Custom property
  allowedDevOrigins: [
    'ais-dev-lkij3dekerf3mewwy665cj-576310300019.asia-east1.run.app',
    'localhost:3000',
    '*.render.com',
    '*.vercel.app',
  ],
  serverExternalPackages: [],
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Allow access to remote image placeholder.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  compress: true,
  poweredByHeader: false,
  transpilePackages: ['motion'],
  devIndicators: false,
  webpack: (config, {dev, isServer}) => {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }

    config.resolve = {
      ...config.resolve,
      fallback: {
        ...(config.resolve?.fallback || {}),
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      },
    };
    return config;
  },
};

export default nextConfig;
// Force Vercel rebuild for latest commit
