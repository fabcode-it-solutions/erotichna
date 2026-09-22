"use client";
import AgeRestrictionDialog from "@/components/global/AgeRestriction/AgeRestrictionDialog";
import useTheme from "@/contexts/theme/ThemeProvider";
import { generateBunnyToken } from "@/libs/token/GenerateBunnyToken";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

const MainWrapper = ({ children, className }) => {
  const path = usePathname();
  const {
    setHideHeaderMain,
    setHideFooterMain,
    hideHeaderMain,
    hideFooterMain,
  } = useTheme();
  useEffect(() => {
   
   
    if (hideFooterMain) {
      setHideFooterMain(false);
    }
    if (hideHeaderMain) {
      setHideHeaderMain(false);
    }
  }, [path]);
  return <main className={className || ""}>
    <AgeRestrictionDialog />
    {children}</main>;
};

export default MainWrapper;
