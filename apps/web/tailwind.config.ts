import type { Config } from 'tailwindcss';
import sharedConfig from '@mtr/tailwind-config';

/** @type {import('tailwindcss').Config} */
const config: Pick<Config, 'content' | 'presets'> = {
  // 스캔할 파일 경로 지정
  content: [
    // 현재 앱의 소스 코드 (src 기반 구조만 사용)
    './src/**/*.{js,ts,jsx,tsx,mdx}',

    // 모노레포 공유 패키지 경로
    '../../packages/ui/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  // 공유 설정을 프리셋으로 사용
  presets: [sharedConfig],
};

export default config;
