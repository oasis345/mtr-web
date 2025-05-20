import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import rootConfig from "../../eslint.config.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // 루트 설정 상속
  ...rootConfig,
  // Next.js 규칙
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // 프로젝트 특화 규칙
  {
    rules: {
      // Next.js 특화 규칙
      "@next/next/no-html-link-for-pages": "error",
      "@next/next/no-img-element": "error",
      // 프로젝트 특화 규칙
      "react/react-in-jsx-scope": "off", // Next.js는 자동으로 React를 import
    },
    settings: {
      next: {
        rootDir: ".",
      },
    },
  },
];

export default eslintConfig;
