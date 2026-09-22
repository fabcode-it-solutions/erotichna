import React from "react";

const TitleDivider = ({ title, className, children }) => {
  return (
    <div
      className={`relative bg-black h-[50px] flex items-center justify-center before:bg-white before:w-full before:absolute before:h-[1px] before:top-[23px]`}
    >
      <h2
        className={`${
          className || ""
        } px-2.5 bg-black z-[1] relative mb-2xl:text-sm font-normal uppercase text-[25px] text-white leading-none `}
      >
        {title || children || 'Heading'}
      </h2>
    </div>
  );
};

export default TitleDivider;
