import tseslint from 'typescript-eslint';
import pluginPrettier from 'eslint-config-prettier';
import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
});

export default tseslint.config(
  // 1. 전역적으로 무시할 파일 패턴
  {
    ignores: [
      '**/node_modules/',
      '**/.next/',
      '**/dist/',
      '**/build/',
      '**/.turbo/',
      '**/coverage/',
      'chartsample/',
    ],
  },

  // 2. 타입 정보가 "필요 없는" 기본 규칙 설정
  // 모든 ts/js 파일에 적용됩니다.
  ...tseslint.configs.recommended.map(config => ({
    ...config,
    files: ['**/*.{ts,tsx,js,jsx,mjs,cjs}'],
  })),

  // 3. 타입 정보가 "필요한" 규칙 설정 (핵심 수정 사항)
  // typescript-eslint가 각 파일에 맞는 tsconfig.json을 자동으로 찾도록 합니다.
  {
    files: ['apps/**/*.ts?(x)', 'packages/**/*.ts?(x)'],
    extends: [...tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        project: true, // true로 설정하여 자동 탐지 활성화
        tsconfigRootDir: __dirname, // 모노레포 루트 디렉토리를 기준으로 찾음
      },
    },
    rules: {
      // 여기에 타입 정보가 필요한 규칙들을 추가하세요.
      // 예: '@typescript-eslint/no-floating-promises': 'error'
    },
  },

  // 4. Next.js 앱을 위한 설정 (apps/web)
  // compat.extends는 레거시 설정을 Flat Config로 변환해줍니다.
  ...compat.extends('next/core-web-vitals').map(config => ({
    ...config,
    files: ['apps/web/**/*.{js,jsx,ts,tsx}'],
  })),

  // 5. Prettier와 충돌 방지 (가장 마지막에 위치)
  pluginPrettier,
);
