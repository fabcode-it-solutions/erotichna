"use client";
import IconImage from "@/assets/icons/IconImage";
import ModelSkeleton from "@/components/global/Loading/ModelSkeleton/ModelSkeleton";
import TitleDivider from "@/components/global/TitleDivider/TitleDivider";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Performers = ({ title, showAllVideo, items, query }) => {
  return (
    <div className=" bg-black pb-2.5">
      <TitleDivider title={title || "Videos"} />
      <div className="grid grid-cols-6 mb-2xl:grid-cols-2 max-lg-dx:grid-cols-3 max-lg-mb:grid-cols-2 gap-2.5 p-[5px]">
        {!items &&
          [0, 1, 2, 3, 4, 5].map((item, i) => <ModelSkeleton key={i} />)}
        {items.length > 0 &&
          items.map((item, i) => (
            <div key={i} className="w-full relative group/banner ">
              <Link
                href={
                  item?.link ? item?.link : `/models/${item?.seo?.permalink}`
                }
                className="transition-all bg-black bg-opacity-40 duration-300 opacity-0 z-[3] w-full h-full flex items-center justify-center  group-hover/banner:opacity-100 absolute top-0 left-0"
              >
                <span className="block px-9 py-3.5 transition-all duration-300 text-white uppercase hover:bg-white !bg-opacity-20 text-[22px] leading-none font-normal">
                  VIEW
                </span>
              </Link>
              <div className="pb-[170.97%] relative w-full">
                <Image
                  src={
                    item?.image?.replace(
                      "https://storage.bunnycdn.com/assets-erotichna",
                      "https://files-erotichna.b-cdn.net"
                    ) ||
                    item?.profile_image?.replace(
                      "https://storage.bunnycdn.com/assets-erotichna",
                      "https://files-erotichna.b-cdn.net"
                    ) ||
                    "/assets/images/placeholder-dark.png"
                  }
                  width={1080}
                  unoptimized={true}
                  height={1920}
                  className="w-full h-full object-cover absolute top-0 left-0 z-[1] transition-all duration-500 opacity-100 "
                  alt="Performers"
                />
              </div>
              <h3 className="text-xl leading-none text-white mb-2xl:text-base pt-[5px] font-normal">
                {item?.heading}
              </h3>
            </div>
          ))}
      </div>
      {showAllVideo && (
        <div className="py-2.5 flex justify-center">
          <Link
            href={`/models` || "#"}
            className="text-white text-lg leading-none uppercase border-2 border-white px-3 py-2"
          >
            Show all Models
          </Link>
        </div>
      )}
    </div>
  );
};

export default Performers;
