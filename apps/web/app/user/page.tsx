"use client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useAuthStore } from "@/store/userAuthStore";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useRouter } from "next/navigation";

export default function AuthCallbackPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>{user?.name}</CardTitle>
          <CardDescription>Deploy your new project in one-click.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label>시드머니</Label>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex">
          <Button
            onClick={() => {
              logout();
              router.push("/");
            }}
          >
            로그아웃
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
