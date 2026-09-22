"use client";
import React, { useState } from "react";
import BannerSection from "../BannerSection";
import HeaderHeading from "@/components/dashboard/HeaderHeading/HeaderHeading";
import IconArrowForward from "@/assets/icons/IconArrowForward";
import Upcoming from "../Upcoming";
import MobileHeader from "@/components/dashboard/MobileHeader/MobileHeader";

const Index = () => {

  const [activeSection, setActiveSection] = useState( {
    label: "Upcoming Scene",
    value: "upcoming-scene",
    section:<Upcoming />
  });

  const sections = [
    {
      label: "Upcoming Scene",
      value: "upcoming-scene",
      section:<Upcoming />
    },
  ];
  return (
    <div>
      <HeaderHeading title="Models Page" description="Edit Models Page Sections" />
      <MobileHeader heading='Models Page' />
      <div className="flex border-t border-stroke py-6 my-6 gap-0 max-md-tab:flex-wrap max-md-tab:border-0 max-md-tab:mt-0">
      <div className="flex-1 max-w-[480px] bg-warm p-4 max-md-tab:max-w-full max-md-tab:w-full max-md-tab:flex-none">
          <ul className="w-full sticky top-3 border-b border-stroke">
            <div className="p-0  text-heading text-xl font-medium max-lg-mb:text-lg font-satoshi leading-7 mb-4">
              All Sections
            </div>
            {sections.length > 0 &&
              sections.map((item, i) => (
                <li
                  key={i}
                  onClick={() => setActiveSection(item)}
                  className={`flex items-center justify-between gap-4 p-3 cursor-pointer  ${
                    activeSection?.value == item.value ? "bg-white cursor-default" : ""
                  }  border-t border-stroke`}
                >
                  {item?.label} <IconArrowForward />
                </li>
              ))}
          </ul>
        </div>
        <div className="flex-[2] border border-warm p-4 relative max-md-tab:max-w-full max-md-tab:w-full max-md-tab:flex-none">
          <h2
            className="font-satoshi relative max-lg-mb:w-full text-xl font-medium leading-6 text-[#242424] text-opacity-90 !flex gap-1.5 items-center
            max-lg-mb:text-[15px] max-lg-mb:leading-[22px] mb-6
            "
          >
            {activeSection?.label}
          </h2>

          {activeSection?.section}
        </div>
      </div>
    </div>
  );
};

export default Index;
