"use client";
import { useEffect, useState } from "react";
import './style.css'
const FilterBar = ({ items, setActiveFilter, className, countStyle, wrapperStyle, tabStyle,active, activeStyle  }) => {
  const [tab, setTab] = useState("");
  useEffect(() => {
    if (items && items[0].value !== tab) {
      setTab(items[0].value);
    }
        // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (tab !== "") {
      setActiveFilter(tab);
    }
        // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);
  useEffect(() => {
    if (active !== "") {
      setTab(active);
      setActiveFilter(active);
    }
        // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);
  return (
    <div className={`mt-[34px] border-b border-stroke pb-1.5 max-lg-mb:m-0 ${className || ''}`}>
      <div className={`justify-start items-start gap-6 inline-flex ${wrapperStyle || ''}`}>
        {items &&
          items.map((item, i) => (
            <button
              onClick={() => setTab(item.value)}
              key={i}
              className={`text-center  text-sm font-medium font-satoshi leading-6 relative ${tabStyle || ''} ${
                item.value === tab ? "text-[#151516] active" : "text-[#636363] "
              }`}
            >
              {item.label}
              {item.value === tab && (
                <span className={`w-full absolute bottom-[-7px] left-0 h-[1px] rounded-lg bg-main-black ${activeStyle || ''}`}></span>
              )}
              {item.count && (
                <div className={`max-lg-mb:min-w-[14.33px] max-lg-mb:left-auto max-lg-mb:right-[-18.23px] text-center absolute top-[-2px] left-full text-white text-[8.14px] font-medium font-satoshi leading-3 h-[13.71px] px-[4.07px] py-[1.36px] bg-[#00bfb3] rounded flex-col justify-center items-center gap-[6.79px] inline-flex ${countStyle || ''}`}>
                  {item.count}
                </div>
              )}
            </button>
          ))}
      </div>
    </div>
  );
};

export default FilterBar;
