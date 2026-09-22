"use client";
import React from "react";
import Iconhamburger from "@/assets/icons/Iconhamburger";
import useAdmin from "@/contexts/admin/AdminDataProvider";
import Link from "next/link";
import IconHome from "@/assets/icons/IconHome";
import Wrapper from "@/components/ui/wrapper/Wrapper";

const MobileHeader = ({ heading, hamburger = true }) => {
  const { setSideMenu } = useAdmin();
  return (
    <Wrapper className="hidden sticky top-0 z-[9999] max-lg-mb:flex justify-between items-center bg-white border-b border-stroke -mx-4 w-full px-4 py-2.5 max-lg-mb:w-[calc(100%+32px)]">
      <button
        onClick={() => setSideMenu(true)}
        className={!hamburger ? "invisible" : ""}
      >
        <Iconhamburger />
      </button>
      <div
        className={` text-heading text-lg font-bold font-satoshi leading-7 `}
      >
        {heading}
      </div>
      <div>
      <Link
        href="/"
        className="bg-black items-center justify-center text-white text-base font-medium px-1 py-1 min-w-[39px] min-h-[39px]
  transition-all duration-300 hover:bg-[#ff4040] hover:text-white w-full flex gap-2 max-md-tab:flex-wrap rounded-lg"
      >
        <IconHome stroke="#fff" className="w-4 h-4 block" />
      </Link>
      </div>
    </Wrapper>
  );
};

export default MobileHeader;
