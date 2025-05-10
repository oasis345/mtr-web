"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ClientAPICall } from "@/lib/axios";
import { useAuthStore } from "@/store/userAuthStore";
import { API_ROUTES } from "@/const/api";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data } = await ClientAPICall.get(API_ROUTES.USER.PROFILE.url);
        setUser(data);
        router.push("/");
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-600 dark:text-gray-400">로그인 처리중...</div>
    </div>
  );
}
