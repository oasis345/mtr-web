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
    ignores: ['**/node_modules/', '**/.next/', '**/dist/', '**/build/', '**/.turbo/', '**/coverage/'],
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
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      // 엄격한 타입 체크 규칙들을 완전히 비활성화
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-enum-comparison': 'off',

      // 기본적인 타입 규칙만 유지
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: {
            attributes: false,
          },
        },
      ],
      'react-hooks/exhaustive-deps': 'off',
    },
  },

  // 4. Next.js 앱을 위한 설정 (apps/web)
  // compat.extends는 레거시 설정을 Flat Config로 변환해줍니다.
  ...compat.extends('next/core-web-vitals').map(config => ({
    ...config,
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
  })),

  // 5. Prettier와 충돌 방지 (가장 마지막에 위치)
  pluginPrettier,
);
