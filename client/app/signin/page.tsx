"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SignIn() {
  const googleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = `${process.env.NEXT_PUBLIC_API_URL}/auth/google/callback`;
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=email profile`;
    window.location.href = url;
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">이즈나우 로그인</h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            소셜 계정으로 간편하게 로그인하세요.
            <br />
            회원가입시 이즈나우의{" "}
            <Link href="/pp" className="text-blue-500">
              이용약관
            </Link>{" "}
            및{" "}
            <Link href="/tos" className="text-blue-500">
              개인정보처리방침
            </Link>{" "}
            에 동의하게 됩니다.
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <Button onClick={googleLogin} className="w-full">
            <Image src="/icons/google.svg" alt="Google" width={20} height={20} />
            <span className="font-bold">Google로 계속하기</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
