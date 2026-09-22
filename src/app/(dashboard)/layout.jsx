import { DashboardDataProvider } from "@/contexts/dashboard/DashboardDataProvider";
import SideBar from "@/layouts/(dashboard)/sidebar/SideBar";
import React from "react";

export const metadata = {
  title: "Dashboard - Erotichna",
};

export default async function DashboardLayout({ children }) {
  return (
    <div className="flex bg-warm min-h-screen ">
      <SideBar />
      <div className={`bg-warm flex-1 pt-2 pb-2 pr-2 pl-[3px] max-lg-mb:p-0`}>
        <div
          className={`bg-white hide-scroll-bar max-h-[calc(100dvh-16px)] overflow-auto max-lg-mb:pb-20 outline-1 outline-stroke outline max-lg-mb:shadow-none max-lg-mb:rounded-none rounded-[20px] shadow-2xl-large w-full p-8 h-full relative max-lg-mb:border-0 max-lg-mb:bg-light-50 max-lg-mb:py-0 max-lg-mb:px-4 `}
        >
          <DashboardDataProvider>{children}</DashboardDataProvider>
        </div>
      </div>
    </div>
  );
}
