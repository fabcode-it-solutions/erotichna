"use client";

import React from "react";
import { useRouter } from "next/navigation";
import IconLogout from "@/assets/icons/IconLogout";
import IconFilter from "@/assets/icons/IconFilter";
import useAuth from "@/contexts/auth/AuthProvider";

const LogoutButton = ({
  redirectPath = "/login",
  buttonText = "Logout",
  className = "",
}) => {
  const router = useRouter();
  const { setUser, setUserloggedIn, setUserSession } = useAuth();
  const handleClearCookie = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });

      if (res.ok) {
        setUser(false);
        setUserloggedIn(false);
        setUserSession(false);
        setTimeout(() => router.push(redirectPath), 100);
        console.log("Cookie cleared successfully!");
      } else {
        console.error("Failed to clear the cookie");
      }
    } catch (error) {
      console.error("Error clearing the cookie:", error);
    }
  };

  return (
    <button
      onClick={handleClearCookie}
      className={`flex items-center gap-x-1 px-3 py-2 ${className}`}
    >
      <IconLogout fill={"#fff"} />
      <span className="text-white">{buttonText}</span>
    </button>
  );
};

export default LogoutButton;
