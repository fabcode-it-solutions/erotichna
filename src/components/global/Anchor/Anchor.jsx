import Link from "next/link";
import React from "react";

const Anchor = ({ className, href, label, children }) => {
  return (
    <Link
      href={href || "#"}
      className={`bg-[#ff4040] uppercase flex items-center justify-center text-white text-base font-medium px-10 py-1 min-h-[48px]
  transition-all duration-300 hover:bg-white hover:text-black
  ${className || ""}`}
    >
      {children || ""} {label || ""}
    </Link>
  );
};

export default Anchor;
