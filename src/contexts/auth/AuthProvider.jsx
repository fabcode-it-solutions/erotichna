"use client";

import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
const AuthContext = React.createContext();

export default function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children, session }) {
  const [user, setUser] = useState(false);
  const router = useRouter();
  const [userSession, setUserSession] = useState(false);
  const [userloggedIn, setUserloggedIn] = useState(false);

  useEffect(() => {
    setUserSession(session);
    if (session != "null") {
      const jsuser = JSON.parse(session);
      if (jsuser?.error) {
        handleClearCookie();
        return;
      }
      localStorage.setItem("userid", jsuser?._id);
      setUser(jsuser);
      setUserloggedIn(true);
    }
  }, [session]);
  const handleClearCookie = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });

      if (res.ok) {
        setTimeout(() => router.push("/login"), 100);
        alert("Your login session expired, please login again");
      } else {
        console.error("Failed to clear the cookie");
      }
    } catch (error) {
      console.error("Error clearing the cookie:", error);
    }
  };
  const value = {
    user,
    setUser,
    userloggedIn,
    setUserloggedIn,
    userSession,
    setUserSession,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
