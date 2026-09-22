"use client";
import PlayButton from "@/assets/icons/PlayButton";
import useTheme from "@/contexts/theme/ThemeProvider";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import VideoPlayer from "@/components/global/videoPlayer/VideoPlayer";
import { useIsMobile } from "@/utils/useIsMobile";
const PostCard = ({ item }) => {
  const { fonts } = useTheme();
  const [models, setModels] = useState(false);
  const isMobile = useIsMobile();
  const [isPlaying, setIsPlaying] = useState(false);
  const handleClick = () => {
    if (isMobile) setIsPlaying(!isPlaying);
  };
  const getModels = async (id) => {
    try {
      const response = await fetch(
        `/api/admin/models/get-model-video?id=${id}`
      );
      const data = await response.json();
      if (!data.error) {
        setModels(data.model);
      } else {
      }
    } catch (error) {
    } finally {
    }
  };
  useEffect(() => {
    if (item?.video?.src) {
      getModels(item?.video?.src);
    }
  }, [item?.video?.src]);

  return (
    <div className="w-full relative">
      {/* <div className="w-full relative group/banner  overflow-hidden mb-2xl:pb-[0]"> */}
      <div
        className="w-full relative group/banner  overflow-hidden mb-2xl:pb-[0]"
        onClick={handleClick}
      >
        <Link
          // className="border border-main-black min-w-12 flex justify-center items-center absolute top-0 left-0 w-full h-full z-[4]"
          className="min-w-12 flex justify-center items-center absolute top-0 left-0 w-full h-full z-[4] max-lg-mb:w-[74px] max-lg-mb:h-[74px] max-lg-mb:top-1/2 max-lg-mb:left-1/2 max-lg-mb:-translate-x-1/2 max-lg-mb:-translate-y-1/2 max-lg-mb:border-0"
          href={`${
            item?.link ? item?.link : `/videos/${item?.seo?.permalink}` || "#"
          } `}
        >
          <PlayButton className="w-[74px] h-[74px] duration-300 hover:scale-110" />
        </Link>
        <Image
          src={
            item.poster?.replace(
              "https://storage.bunnycdn.com/assets-erotichna",
              "https://files-erotichna.b-cdn.net"
            ) ||
            item?.image?.replace(
              "https://storage.bunnycdn.com/assets-erotichna",
              "https://files-erotichna.b-cdn.net"
            ) ||
            "/assets/images/placeholder-dark.png"
          }
          unoptimized={true}
          width={900}
          height={600}
          // className="w-full h-full object-cover absolute top-0 left-0 z-[1] transition-all duration-500 opacity-100
          // group-hover/banner:opacity-0"
          className={`w-full h-full object-cover absolute top-0 left-0 z-[1] transition-all duration-500 opacity-100 group-hover/banner:opacity-0 ${
            isMobile ? (isPlaying ? "opacity-0" : "opacity-100") : ""
          }`}
          alt="Image"
        />
        {(item?.video?.src || item?.hoveredVideo?.src) && (
          <VideoPlayer
            key={item?.video?.src || item?.hoveredVideo?.src}
            startLevel={1}
            videoId={item?.hoveredVideo?.src || item?.video?.src}
            // className=" h-full aspect-video  transition-all duration-500 opacity-0 group-hover/banner:opacity-100"
            className={` h-full aspect-video transition-all duration-500 opacity-0 group-hover/banner:opacity-100 ${
              isMobile ? (isPlaying ? "opacity-100" : "opacity-0") : ""
            }`}
          />
        )}
      </div>
      <div className="absolute bottom-[10%] left-[10%] z-[5]">
        <Link
          href={`${
            item?.link ? item?.link : `/videos/${item?.seo?.permalink}` || "#"
          } `}
          className={`${fonts?.cormorant_Garamond} block text-[18px] leading-[22px] tracking-[0.08em] font-semibold text-white italic`}
        >
          {item.heading} {item.title}
        </Link>
        <div className="flex gap-1 flex-wrap">
          {item?.model && item?.model?.length > 0
            ? item?.model.map((item, i) => (
                <div key={i} className="flex gap-1">
                  {i > 0 && (
                    <span
                      className={`${fonts?.cinzel} uppercase block  text-white text-[24px] font-bold`}
                    >
                      ,
                    </span>
                  )}
                  <Link
                    href={item.link || "#"}
                    className={`${fonts?.cinzel} uppercase block underline text-white text-[24px] font-bold`}
                  >
                    {item.name}
                  </Link>
                </div>
              ))
            : models &&
              models.length > 0 &&
              models.map((item, i) => (
                <div key={i} className="flex gap-1">
                  {i > 0 && (
                    <span
                      className={`${fonts?.cinzel} uppercase block  text-white text-[24px] font-bold`}
                    >
                      ,
                    </span>
                  )}
                  <Link
                    href={item.link || "#"}
                    className={`${fonts?.cinzel} uppercase block underline text-white text-[24px] font-bold`}
                  >
                    {item.name}
                  </Link>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(PostCard);
