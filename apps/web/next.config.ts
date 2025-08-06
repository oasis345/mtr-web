import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@mtr/ui', '@mtr/services', '@mtr/utils', '@mtr/finance'],

  // webpack: config => {
  //   config.resolve.symlinks = false;

  //   return config;
  // },
};

export default nextConfig;
