"use client";
import { useRouter, useSearchParams } from "next/navigation";
import useAuth from "@/contexts/auth/AuthProvider";
import { useEffect } from "react";

export default function SocialCallback() {
  const router = useRouter();
  const params = useSearchParams();
  const { setUser } = useAuth();

  useEffect(() => {
    const data = params.get("data");
    if (!data) return;

    const user = JSON.parse(decodeURIComponent(data));
    console.log("🌟 Social login user →", user);

    // Store user in context
    setUser(user);

    // Redirect based on role
    if (user.role === "admin") {
      router.replace("/dashboard");
    } else {
      router.replace("/");
    }
  }, []);

  return <p className="text-center text-white">Signing user you in...</p>;
}
