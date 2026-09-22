"use client";
import IconArrowBackword from "@/assets/icons/IconArrowBackword";
import IconArrowForward from "@/assets/icons/IconArrowForward";
import Wrapper from "@/components/ui/wrapper/Wrapper";

import { useEffect, useState } from "react";

const Pagination = ({
  count,
  index,
  getIndex,
  visiblePages = 8,
  dark,
  darkMode,
}) => {
  const [_index, setIndex] = useState(index);
  const [arrowBackword, setArrowBackword] = useState(false);
  const [arrowForward, setArrowForward] = useState(true);

  useEffect(() => {
    setArrowBackword(_index > 0);
    setArrowForward(_index < count - 1);
  }, [_index, count]);

  useEffect(() => {
    setIndex(index);
  }, [index]);

  const backword = () => {
    if (_index > 0) {
      const newIndex = _index - 1;
      setIndex(newIndex);
      getIndex(newIndex);
    }
  };

  const forward = () => {
    if (_index < count - 1) {
      const newIndex = _index + 1;
      setIndex(newIndex);
      getIndex(newIndex);
    }
  };

  const setCount = (i) => {
    setIndex(i);
    getIndex(i);
  };

  const renderPagination = () => {
    const pages = [];
    const halfVisible = Math.floor(visiblePages / 2);
    let startPage = Math.max(0, _index - halfVisible);
    let endPage = Math.min(count - 1, _index + halfVisible);

    // Adjust range if the end page is close to the total count
    if (endPage - startPage + 1 < visiblePages) {
      if (endPage === count - 1) {
        startPage = Math.max(0, count - visiblePages);
      } else {
        endPage = Math.min(count - 1, startPage + visiblePages - 1);
      }
    }

    // Add first page if not included
    if (startPage > 0) {
      pages.push(
        <div
          key={0}
          onClick={() => setCount(0)}
          className={`w-[50px] h-[50px] max-lg-mb:w-[30px] max-lg-mb:h-[30px]  overflow-hidden cursor-pointer  ${
            dark ? "hover:bg-warm" : "hover:bg-dark-150"
          } duration-300 transition-all flex justify-center items-center rounded-full text-[20px] max-lg-mb:text-[14px] leading-none pointer-events-none border 
          `}
        >
          1
        </div>
      );
      if (startPage > 1) {
        pages.push(
          <span key="ellipsis1" className="max-lg-mb:hidden">
            <IconDots />
          </span>
        );
      }
    }

    // Add page numbers in the visible range
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <div
          key={i}
          onClick={() => setCount(i)}
          className={`w-[50px] h-[50px] max-lg-mb:w-[30px] max-lg-mb:h-[30px] overflow-hidden cursor-pointer  ${
            dark ? "hover:bg-warm" : "hover:bg-dark-150"
          } duration-300 transition-all flex justify-center items-center rounded-full text-[20px] max-lg-mb:text-[14px] leading-none ${
            _index === i
              ? `pointer-events-none border ${
                  dark
                    ? " text-black  border-black"
                    : " text-white border-white"
                }`
              : ` ${dark ? "text-black" : "text-white"}`
          }
          `}
        >
          {i + 1}
        </div>
      );
    }

    // Add last page if not included
    if (endPage < count - 1) {
      if (endPage < count - 2) {
        pages.push(
          <span key="ellipsis2">
            <IconDots />
          </span>
        );
      }
      pages.push(
        <div
          key={count - 1}
          onClick={() => setCount(count - 1)}
          className={`w-[50px] h-[50px] max-lg-mb:w-[30px] max-lg-mb:h-[30px] overflow-hidden cursor-pointer  ${
            dark ? "hover:bg-warm" : "hover:bg-dark-150"
          } duration-300 transition-all flex justify-center items-center rounded-full text-[20px] max-lg-mb:text-[14px] leading-none 
          `}
        >
          {count}
        </div>
      );
    }

    return pages;
  };

  return (
    <Wrapper className="flex gap-1.5 justify-center">
      <div
        onClick={() => setCount(0)}
        className={`cursor-pointer w-[50px] h-[50px] max-lg-mb:w-[30px] max-lg-mb:h-[30px] rounded-full  justify-center items-center gap-1 inline-flex text-dark-150 text-lg max-lg-mb:text-sm font-normal font-satoshi leading-tight
         ${dark ? "text-dark-150" : "text-white"}
            `}
      >
        First
      </div>
      <div
        onClick={backword}
        className={`w-[50px] h-[50px] max-lg-mb:w-[30px] max-lg-mb:h-[30px] rounded-full  cursor-pointer justify-center items-center gap-1 inline-flex text-text-secondary text-sm font-normal font-satoshi leading-tight
           ${
             !arrowBackword
               ? "opacity-60 cursor-not-allowed pointer-events-none"
               : "cursor-pointer"
           } 
           
             `}
      >
        <IconArrowBackword
          className={`w-10 h-10  ${dark ? "fill-black" : "fill-white"}`}
        />
      </div>

      {renderPagination()}

      <div
        onClick={forward}
        className={`cursor-pointer w-[50px] h-[50px] max-lg-mb:w-[30px] max-lg-mb:h-[30px] rounded-full  justify-center items-center gap-1 inline-flex text-dark-150 text-sm font-normal font-satoshi leading-tight
           ${
             !arrowForward
               ? "opacity-60 cursor-not-allowed pointer-events-none"
               : "cursor-pointer"
           }
           `}
      >
        <IconArrowForward
          className={`w-10 h-10  ${dark ? "fill-black" : "fill-white"}`}
        />
      </div>
      <div
        onClick={() => setCount(count - 1)}
        className={`cursor-pointer w-[50px] h-[50px] max-lg-mb:w-[30px] max-lg-mb:h-[30px] rounded-full  justify-center items-center gap-1 inline-flex  text-lg max-lg-mb:text-sm font-normal font-satoshi leading-tight
          ${dark ? "text-dark-150" : "text-white"}
            `}
      >
        Last
      </div>
    </Wrapper>
  );
};

export default Pagination;

const IconDots = () => {
  return (
    <div className="w-[31px] h-9 px-3 py-2 cursor-not-allowed rounded border border-[#eaeaea] flex-col justify-center items-center inline-flex">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2.40039 8.00078C2.40039 7.33804 2.93765 6.80078 3.60039 6.80078C4.26313 6.80078 4.80039 7.33804 4.80039 8.00078C4.80039 8.66352 4.26313 9.20078 3.60039 9.20078C2.93765 9.20078 2.40039 8.66352 2.40039 8.00078Z"
          fill="#242424"
        />
        <path
          d="M6.80039 8.00078C6.80039 7.33804 7.33765 6.80078 8.00039 6.80078C8.66313 6.80078 9.20039 7.33804 9.20039 8.00078C9.20039 8.66352 8.66313 9.20078 8.00039 9.20078C7.33765 9.20078 6.80039 8.66352 6.80039 8.00078Z"
          fill="#242424"
        />
        <path
          d="M12.4004 6.80078C11.7376 6.80078 11.2004 7.33804 11.2004 8.00078C11.2004 8.66352 11.7376 9.20078 12.4004 9.20078C13.0631 9.20078 13.6004 8.66352 13.6004 8.00078C13.6004 7.33804 13.0631 6.80078 12.4004 6.80078Z"
          fill="#242424"
        />
      </svg>
    </div>
  );
};
