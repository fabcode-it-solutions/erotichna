"use client";
import IconCalander from "@/assets/icons/IconCalander";
import "./style.css";
import { useState } from "react";
import Text from "@/components/ui/text/Text";
const InputDashboard = ({
  type,
  placeholder,
  required,
  label,
  setInputData,
  value,
  name,
  labelBgColor,
  className,
  info
}) => {
  const [dateText, setDateText] = useState("");
  const getDateText = (e) => {
    setDateText(e.target.value);
    setInputData(e.target.value);
  };
  return (
    <div className="flex flex-col gap-3 w-full max-lg-mb:gap-2">
      {label && (
        <label
          className={`${
            labelBgColor || ""
          } text-[#232323] text-sm font-medium font-satoshi leading-[19px]`}
        >
          {label}{" "}
          {info && (
            <span className="text-xs text-text-secondary font-satoshi">
              {info}
            </span>
          )}
        </label>
      )}
      <div className={`relative w-full`}>
        {type !== "date" && (
          <input
            name={name}
            type={type}
            autoComplete={type}
            placeholder={placeholder}
            required={required}
            value={value}
            onChange={(e) => {
              setInputData(e);
            }}
            className={`${className || ""} ${
              label ? "placeholder-opacity-0 placeholder-transparent " : ""
            } 
          ${type === "date" ? " w-full" : ""}
          h-[43px] px-[15px] py-3 bg-white rounded-lg border border-[#eaeaea] justify-start items-center gap-2.5 flex w-full text-main-black placeholder:text-[#aaaaaa] text-sm font-normal font-satoshi
          `}
          />
        )}
        {type === "date" && (
          <input
            name={name}
            type={type}
            autoComplete={type}
            placeholder={placeholder}
            required={required}
            value={value}
            onChange={(e) => {
              getDateText(e);
            }}
            className={`${className || ""} ${
              label ? "placeholder-opacity-0 placeholder-transparent " : ""
            } 
           h-[43px] px-[15px]  py-3 bg-white rounded-lg border border-[#eaeaea] justify-start items-center gap-2.5 block  w-full text-main-black placeholder:text-[#aaaaaa] text-sm font-normal font-satoshi
          `}
          />
        )}
        {type === "date" && (
          <Text className="absolute top-[12.5px] left-[15px] pointer-events-none !text-sm !text-[#ABABAB] !font-satoshi !font-normal !leading-[19px]">
            {dateText || placeholder}
          </Text>
        )}
        {type === "date" && (
          <IconCalander className="fill-[#292D32] absolute top-3 right-[15px] pointer-events-none" />
        )}
      </div>
    </div>
  );
};

export default InputDashboard;
