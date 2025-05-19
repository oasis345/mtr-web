"use client";
import { ThemeButton } from "@/components/buttons/ThemeButton";
import { UserCircleIcon } from "@heroicons/react/20/solid";
import { useAuthStore } from "@/store/userAuthStore";
import Link from "next/link";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user } = useAuthStore();
  const router = useRouter();

  return (
    <nav className="border-b-2 relative z-30">
      <div className="flex justify-end items-center">
        <ThemeButton />
        {user ? (
          <Link href={`/user`}>
            <UserCircleIcon className="h-8 w-8" />
          </Link>
        ) : (
          <Button variant="outline" onClick={() => router.push("/signin")}>
            <span className="font-bold">로그인</span>
          </Button>
        )}
      </div>
    </nav>
  );
}
