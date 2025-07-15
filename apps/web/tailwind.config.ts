// apps/web/tailwind.config.ts
import type { Config } from 'tailwindcss';
import uiConfig from '@mtr/ui/tailwind-config';

/** @type {import('tailwindcss').Config} */
const config: Config = {
  darkMode: ['class'],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
    '!**/node_modules/**',
    '!**/*.d.ts',
  ],
  presets: [uiConfig as Partial<Config>],
};

export default config;
