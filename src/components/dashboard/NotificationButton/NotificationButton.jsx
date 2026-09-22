"use client";
import IconNotification from "@/assets/icons/IconNotification";
import React from "react";

const NotificationButton = ({className}) => {
  
  return (
    <button
      
      className={`rounded-md border border-stroke w-[39px] min-w-[39px] h-[39px] flex items-center justify-center max-lg-mb:border-0 max-lg-mb:min-w-5 max-lg-mb:w-5 max-lg-mb:h-5 ${className || ''}`}
    >
      <div className="relative">
        <span className="bg-[#00BDB3] w-[9px] h-[9px] rounded-full block  right-0 top-0 absolute
        max-sm-tab:w-[10px] max-sm-tab:h-[10px]
        "></span>
        <IconNotification className='w-5 h-5 max-sm-tab:fill-[#242424] max-sm-tab:w-[22px] max-sm-tab:h-[22px]' />
      </div>
    </button>
  );
};

export default NotificationButton;
