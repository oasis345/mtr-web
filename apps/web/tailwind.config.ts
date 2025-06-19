import type { Config } from 'tailwindcss';
import sharedConfig from '@mtr/tailwind-config';

/** @type {import('tailwindcss').Config} */
const config: Pick<Config, 'content' | 'presets'> = {
  // 스캔 범위를 최소화 - 속도 개선의 핵심!
  content: [
    // 현재 앱만 스캔
    './src/**/*.{js,ts,jsx,tsx,mdx}',

    // UI 패키지는 구체적인 경로만
    '../../packages/ui/components/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui/layout/**/*.{js,ts,jsx,tsx}',

    // TypeScript 파일 제외 (JS만)
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],

  presets: [sharedConfig],
};

export default config;
