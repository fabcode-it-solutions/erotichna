"use client";
import { useEffect, useState } from "react";

const GooglePagination = ({ count, index, getIndex }) => {
  const [_index, setIndex] = useState(index);
  const [arrowBackword, setArrowBackword] = useState(false);
  const [arrowForward, setArrowForward] = useState(true);
  const backword = (e) => {
    const number = e - 1;
    if (number > 0) {
      setIndex(number);
      getIndex(e);
      setArrowForward(true);
    }
    if (number === 0) {
      setIndex(0);
      getIndex(0);
      setArrowBackword(false);
      setArrowForward(true);
    }
  };
  const forword = (e) => {
    const number = e + 1;
    setIndex(number);
    setArrowBackword(true);
    getIndex(number);
    if (number === count - 1) {
      setArrowForward(false);
    }
  };
  const setCount = (i) => {
    getIndex(i);
    setIndex(i);
     if (i === count - 1) {
      setArrowForward(false);
    } else {
      setArrowForward(true);
    }
    if (i === 0) {
    setArrowBackword(false);
    }
    else{
        setArrowBackword(true);
    }
  };
  return (
    <div className="flex gap-[10px] justify-center mt-[15px]">
        {arrowBackword && (
      <div
        onClick={() => backword(_index)}
        className={`w-12 text-base text-dark dark:text-white font-medium h-8 border flex items-center justify-center  dark:border-gray-600 border-light-500  ${
          _index === 0 ? "opacity-30 cursor-not-allowed" : " cursor-pointer"
        } `}
      >
       Back
      </div>
      )}
            {!arrowBackword && (
      <div
        className={`w-12 text-base text-dark dark:text-white font-medium h-8 border flex items-center justify-center  dark:border-gray-600 border-light-500 opacity-30 cursor-not-allowed `}
      >
     Back
      </div>
      )}
      <div className='flex gap-[10px] flex-wrap'>
      {Array.from(Array(count), (e, i) => 

         (
          <div
            key={i}
            onClick={() => setCount(i)}
            className={`w-8 text-base text-dark dark:text-white font-medium h-8 border flex items-center justify-center  dark:border-gray-600 border-light-500 ${
              _index === i
                ? "bg-light-500 dark:bg-accent dark:border-accent cursor-not-allowed"
                : "cursor-pointer"
            }`}
          >
            {i + 1}
          </div>
         )
      )}
</div>
      {arrowForward && (
        <div
          onClick={() => forword(_index)}
          className={`cursor-pointer w-12 text-base text-dark dark:text-white font-medium h-8 border flex items-center justify-center  dark:border-gray-600 border-light-500`}
        >
          Next
        </div>
      )}
       {!arrowForward && (
        <div
          className={`opacity-30 cursor-not-allowed w-12 text-base text-dark dark:text-white font-medium h-8 border flex items-center justify-center  dark:border-gray-600 border-light-500`}
        >
         Next
        </div>
      )}
    </div>
  );
};

export default GooglePagination;
