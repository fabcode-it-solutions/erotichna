/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import useAuth from "@/contexts/auth/AuthProvider";
import useTheme from "@/contexts/theme/ThemeProvider";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const DashboardWrapper = ({
  children,
  className,
  parentStyle,
  userLoggedIn,
}) => {
  const path = usePathname();
  const { user, userSession } = useAuth();
  const [loader, setLoader] = useState(true);
  const router = useRouter();
  const {
    setHideHeaderMain,
    setHideFooterMain,
    hideHeaderMain,
    hideFooterMain,
  } = useTheme();

  useEffect(() => {
    if (userSession == "null" && !userLoggedIn) {
      router.push("/");
      return;
    }

    if (userLoggedIn) {
      if (user) {
        setTimeout(() => {
          if (user && (user?.role == "editor" || user?.role == "admin")) {
            setLoader(false);
          } else {
            router.push("/");
          }
        }, 100);
      }
    }

    if (hideFooterMain === false) {
      setHideFooterMain(true);
    }
    if (hideHeaderMain === false) {
      setHideHeaderMain(true);
    }
  }, [path, user, userSession]);

  return (
    <div className={className || ""}>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ease: "easeInOut", duration: 0.25 }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default DashboardWrapper;
