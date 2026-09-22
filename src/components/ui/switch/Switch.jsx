"use client";

import { useEffect, useState } from "react";

const Switch = ({ className, getState, defaultState }) => {
  const [toggle, setToggle] = useState(false);
  useEffect(() => {
    getState(toggle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toggle]);
  useEffect(()=>{
    if (defaultState) {
      setToggle(defaultState);
    }
  },[defaultState]);
  return (
    <div
      className={`py-1.5 justify-start items-center gap-2.5 flex relative cursor-pointer ${
        className || ""
      }`}
    >
      <input
        type="checkbox"
        name="display-available-options"
        checked={toggle}
        onChange={(e) => setToggle(e.target.checked)}
        className={`peer transition-all duration-300 appearance-none h-5 w-9 rounded-3xl  ${
          toggle ? "bg-positive" : "bg-[#F2F0EE]"
        }`}
      />
      <label className="peer-checked:!right-0.5 right-4.5 transition-all pointer-events-none duration-300 shadow-sm absolute w-4 h-4 rounded-full bg-white"></label>
    </div>
  );
};

export default Switch;
