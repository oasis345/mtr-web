import type { Config } from 'tailwindcss';
import sharedConfig from '@mtr/ui/tailwind/config';

/** @type {import('tailwindcss').Config} */
const config: Config = {
  darkMode: ['class'],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',

    // 2. UI 패키지의 모든 소스 코드
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
    // 3. node_modules는 스캔에서 제외 (성능 최적화)
    '!**/node_modules/**',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],

  presets: [sharedConfig],
};

export default config;
