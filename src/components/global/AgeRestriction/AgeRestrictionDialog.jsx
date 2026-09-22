"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const AgeRestrictionDialog = () => {
    const router = useRouter();
    const [showPopup, setShowPopUp] = useState(false);
    useEffect(()=>{
const alreadyIn = localStorage.getItem('AgeRestrictionErotichna');
if(!alreadyIn){
    setShowPopUp(true);
}
else{
    setShowPopUp(false);
}

    },[]);
  return (
    showPopup && 
    <div className="w-full h-full p-4 flex items-center justify-center fixed top-0 left-0 bg-black bg-opacity-50 backdrop-blur-lg z-[99999999999999999999]">
      <div className=" max-w-[560px]">
        <div className="text-center rounded-t-lg overflow-hidden py-4 bg-[#f5cac8]">
          <Image
            src="/assets/images/erotichna-logo-bg.svg"
            alt="Logo"
            width={213}
            unoptimized={true}
            height={35}
            className="w-full max-w-[300px] mx-auto"
          />
        </div>
        <div className="bg-dark-150 p-5 rounded-b-lg border-black">
          <div className="text-white text-2xl text-center font-bodoni mb-4 max-lg-mb:text-lg">
            Confirm you are over 18
          </div>
          <p className="text-white text-sm text-center font-satoshi max-lg-mb:text-xs">
            This website contains age-restricted materials. If you are under the
            age of 18 years, or under the age of majority in the location from
            where you are accessing this website you do not have authorization
            or permission to enter this website or access any of its materials.
            If you are over the age of 18 years or over the age of majority in
            the location from where you are accessing this website by entering
            the website you hereby agree to comply with all the Terms and
            Conditions.
            <br />
            <br />
            By clicking on the &quot;Enter&quot; button, and by entering this
            website you agree with all the above and certify under penalty of
            perjury that you are an adult.
          </p>
          <div className="flex gap-2 justify-center mt-6 max-w-[480px] mx-auto">
            <button onClick={()=>{
router.back();
            }} className="flex-1 cursor-pointer uppercase border border-white flex items-center justify-center text-white text-base font-medium px-10 py-1 min-h-[48px]
  transition-all duration-300 hover:bg-white hover:text-black
  tab-lg:px-5 tab-lg:text-sm tab-lg:py-1.5 max-sm-tab:px-4" type="button">
              Go Back
            </button>
            <button
            onClick={()=>{
                localStorage.setItem('AgeRestrictionErotichna','true');
                setShowPopUp(false);
            }}
              className="bg-[#ff4040] cursor-pointer flex-1 uppercase flex items-center justify-center text-white text-base font-medium px-10 py-1 min-h-[48px]
  transition-all duration-300 hover:bg-white hover:text-black
  tab-lg:px-5 tab-lg:text-sm tab-lg:py-1.5 max-sm-tab:px-4"
              type="button"
            >
              Enter
            </button>
          </div>
        </div>
      </div>
    </div>
        
  );
};

export default AgeRestrictionDialog;
