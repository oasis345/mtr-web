import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  transpilePackages: [
    '@mtr/auth-core',
    '@mtr/error-handler',
    '@mtr/finance-core',
    '@mtr/finance-ui',
    '@mtr/hooks',
    '@mtr/network-core',
    '@mtr/store',
    '@mtr/ui',
    '@mtr/utils',
  ],
  reactStrictMode: false,
  output: 'standalone',
  outputFileTracingRoot: path.join(__dirname, '../../'),
};

export default nextConfig;
