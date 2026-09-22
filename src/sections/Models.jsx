/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect, useCallback } from "react";
import TitleDivider from "@/components/global/TitleDivider/TitleDivider";
import Image from "next/image";
import Link from "next/link";
import Pagination from "@/components/global/pagination/Pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const Models = ({ title, models }) => {
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);
  const limit = 18;
  const [paginatedItems, setPaginatedItems] = useState([]);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );
  useEffect(() => {
    const pages = searchParams.get("page");
    if (pages) {
      const pageIndex = pages - 1;
      setIndex(pageIndex);
    } else {
      setIndex(0);
    }
  }, []);
  useEffect(() => {
    const totalModels = models.length;
    setCount(Math.ceil(totalModels / limit));

    const startIndex = index * limit;
    const endIndex = startIndex + limit;

    setPaginatedItems(models.slice(startIndex, endIndex));
  }, [index, models]);

  const getIndex = (pageIndex) => {
    setIndex(pageIndex);
    router.push(pathname + "?" + createQueryString("page", pageIndex + 1));
  };

  return (
    <div className="bg-black pb-2.5">
      <div className="grid min-3xl:grid-cols-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 p-[5px]">
        {paginatedItems.length > 0 &&
          paginatedItems.map((item, i) => (
            <div key={i} className="w-full relative group/banner">
              <Link
                href={`/models/${item.seo.permalink}`}
                className="transition-all bg-black bg-opacity-40 duration-300 opacity-0 z-[3] w-full h-full flex items-center justify-center group-hover/banner:opacity-100 absolute top-0 left-0"
              >
                <span className="block px-9 py-3.5 transition-all duration-300 text-white uppercase hover:bg-white !bg-opacity-20 text-[22px] leading-none font-normal">
                  VIEW
                </span>
              </Link>
              <div className="pb-[170.97%] relative w-full">
                <Image
                  src={
                    item?.profile_image?.replace(
                      "https://storage.bunnycdn.com/assets-erotichna",
                      "https://files-erotichna.b-cdn.net"
                    ) || "/assets/images/placeholder-dark.png"
                  }
                  unoptimized={true}
                  width={1080}
                  height={1920}
                  className="w-full h-full object-cover absolute top-0 left-0 z-[1] transition-all duration-500 opacity-100"
                  alt="Model"
                />
              </div>
              <h3 className="text-xl leading-none text-white mb-2xl:text-base pt-[5px] font-normal">
                {item?.title}
              </h3>
            </div>
          ))}
      </div>
      <div className="py-[25px]">
        {count > 1 && (
          <Pagination
            count={count}
            getIndex={getIndex}
            index={index}
            visiblePages={8}
            dark={false}
          />
        )}
      </div>
    </div>
  );
};

export default Models;
