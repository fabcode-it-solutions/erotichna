import React from "react";

const SalesCard = ({ heading, money, description, number,className }) => {
  return (
    <div className={`flex-col justify-start items-start inline-flex flex-1 py-2  ${className || ''}`}>
      <div className="flex-col justify-start items-start flex max-lg-mb:w-full">
        <div className="text-heading text-base mb-1 font-bold font-satoshi leading-snug max-lg-mb:text-sm max-lg-mb:font-medium max-lg-mb:leading-[19px]">
          {heading || "Sales"}
        </div>
        <div className="justify-start items-end gap-[25px] inline-flex mt-[23px] mb-[10px] max-lg-mb:my-1.5 max-lg-mb:w-full max-lg-mb:justify-between">
          <div className="text-heading text-[26px] font-bold font-satoshi leading-[35px] max-lg-mb:text-xl max-lg-mb:leading-[27px]">
            {money || "$523,476"}
          </div>
          <div className="relative flex gap-0.5">
            <div className={` text-base font-bold font-satoshi leading-snug ${number > 0 ? "text-positive": "text-negative"}`}>
              {number && (number > 0 ? "+" + number + "%" :  number + "%") }
            </div>
            <div className="w-4 h-4 flex-col justify-start items-start inline-flex">
              {number&& number > 0 && (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.99699 2.00001C7.81128 1.9991 7.62526 2.07511 7.49166 2.22802L2.83164 7.56135C2.58938 7.83861 2.61776 8.25977 2.89502 8.50203C3.17228 8.74429 3.59344 8.71591 3.8357 8.43865L7.33367 4.43526L7.33367 13.3333C7.33367 13.7015 7.63214 14 8.00033 14C8.36852 14 8.667 13.7015 8.667 13.3333V4.44665L12.1656 8.43936C12.4082 8.71628 12.8294 8.74406 13.1064 8.50141C13.3833 8.25876 13.4111 7.83756 13.1684 7.56064L8.55204 2.2923C8.4321 2.11588 8.22975 2 8.00033 2C7.99922 2 7.9981 2 7.99699 2.00001Z"
                    fill="#ABABAB"
                  />
                </svg>
              )}
              {number&&  number < 0 && (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.00301 14C8.18872 14.0009 8.37474 13.9249 8.50834 13.772L13.1684 8.43865C13.4106 8.16139 13.3822 7.74023 13.105 7.49797C12.8277 7.25571 12.4066 7.28409 12.1643 7.56135L8.66633 11.5647L8.66633 2.66667C8.66633 2.29848 8.36786 2 7.99967 2C7.63148 2 7.333 2.29848 7.333 2.66667L7.333 11.5533L3.83441 7.56064C3.59176 7.28372 3.17056 7.25594 2.89364 7.49859C2.61672 7.74124 2.58894 8.16244 2.83159 8.43936L7.44796 13.7077C7.5679 13.8841 7.77025 14 7.99966 14C8.00078 14 8.00189 14 8.00301 14Z"
                    fill="#ABABAB"
                  />
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="text-text-secondary text-sm font-normal font-satoshi leading-[19px]">
        {description || "Compared to ($497,546 last year)"}
      </div>
    </div>
  );
};

export default SalesCard;
