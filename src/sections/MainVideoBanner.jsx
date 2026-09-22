"use client";
import React, { useState } from "react";
import Link from "next/link";
import PlayButton from "@/assets/icons/PlayButton";
import { Container, Flex } from "@radix-ui/themes";
import useTheme from "@/contexts/theme/ThemeProvider";
import VideoPlayer from "@/components/global/videoPlayer/VideoPlayer";
import Image from "next/image";
import useAuth from "@/contexts/auth/AuthProvider";
import { useIsMobile } from "@/utils/useIsMobile";

const MainVideoBanner = ({ data }) => {
  const { fonts } = useTheme();
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const [isPlaying, setIsPlaying] = useState(false);

  const handleMouseEnter = () => {
    if (!isMobile) setIsPlaying(true);
  };

  const handleMouseLeave = () => {
    if (!isMobile) setIsPlaying(false);
  };

  const handleClick = () => {
    if (isMobile) setIsPlaying(!isPlaying);
  };

  return (
    <div
      className="w-full relative group/banner max-lg-mb:pb-[118.3vw] overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <Link
        href={data?.banner?.link || "#"}
        // className="transition-all z-[2] w-[117px] h-[117px] duration-300 opacity-0 group-hover/banner:opacity-100 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        className={`transition-all z-[2] w-[117px] h-[117px] duration-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
          isPlaying ? "opacity-100" : "opacity-0"
        }`}
      >
        <PlayButton />
      </Link>
      <div className="group/banner bg-black">
        {data?.banner?.desktop && (
          <Image
            src={
              data?.banner?.desktop?.replace(
                "https://storage.bunnycdn.com/assets-erotichna",
                "https://files-erotichna.b-cdn.net"
              ) || "/assets/images/placeholder-dark.png"
            }
            width={1920}
            unoptimized={true}
            height={1080}
            alt="banner"
            // className="absolute top-0 left-0 w-full h-full object-cover max-lg-mb:hidden group-hover/banner:opacity-0"
            className={`absolute top-0 left-0 w-full h-full object-cover max-lg-mb:hidden transition-opacity duration-300 ${
              isPlaying ? "opacity-0" : "opacity-100"
            }`}
          />
        )}
        {data?.banner?.mobile && (
          <Image
            src={
              data?.banner?.mobile?.replace(
                "https://storage.bunnycdn.com/assets-erotichna",
                "https://files-erotichna.b-cdn.net"
              ) || "/assets/images/placeholder-dark.png"
            }
            width={1920}
            height={1080}
            unoptimized={true}
            alt="banner"
            // className="absolute top-0 left-0 w-full h-full object-cover max-lg-mb:block hidden group-hover/banner:opacity-0"
            className={`absolute top-0 left-0 w-full h-full object-cover max-lg-mb:block hidden transition-opacity duration-300 ${
              isPlaying ? "opacity-0" : "opacity-100"
            }`}
          />
        )}
        {data?.banner?.video?.link && !isMobile ? (
          <VideoPlayer
            videoId={data?.banner?.video?.link}
            muted={true}
            className={` h-full aspect-video max-lg-mb:w-auto max-lg-mb:absolute max-lg-mb:top-0 max-lg-mb:left-[50%] max-lg-mb:-translate-x-1/2
                           ${
                             data?.banner?.video?.mobileLink
                               ? "max-lg-mb:!hidden"
                               : ""
                           }`}
          />
        ) : (
          <div className="aspect-video"></div>
        )}
        {data?.banner?.video?.mobileLink && isMobile && (
          <VideoPlayer
            videoId={data?.banner?.video?.mobileLink}
            startLevel={1}
            muted={true}
            videoPlayerStyle="!h-full object-cover"
            // className={`opacity-0 mobile-video-up aspect-video transition-all duration-300 group-hover/banner:opacity-100 max-lg-mb:absolute max-lg-mb:!w-full max-lg-mb:h-full max-lg-mb:top-0 max-lg-mb:left-0 max-lg-mb:-translate-x-0
            // ${
            //   data?.banner.video?.mobileLink
            //     ? "!hidden max-lg-mb:!block"
            //     : "!hidden"
            // }
            // `}
            className={`mobile-video-up aspect-video transition-all duration-300 max-lg-mb:absolute max-lg-mb:!w-full max-lg-mb:h-full max-lg-mb:top-0 max-lg-mb:left-0 max-lg-mb:-translate-x-0
            ${
              data?.banner.video?.mobileLink
                ? "!hidden max-lg-mb:!block"
                : "!hidden"
            } ${isPlaying ? "opacity-100" : "opacity-0"}
            `}
          />
        )}
      </div>

      <div className="w-full absolute bottom-0 z-[1] left-0 py-[15%] dex-3xl:py-[5%]">
        <Container className="dex-3xl:px-6 mb-2xl:px-4 px-4">
          <span className="font-bodoni text-base leading-[19px] text-white uppercase">
            {data?.banner?.subHeading}
          </span>
          {data?.banner?.heading && (
            <span
              className={`${fonts?.cormorant_Garamond} block text-2xl leading-[29px] tracking-[0.08em] font-semibold text-white italic`}
            >
              &apos;{data?.banner?.heading}&apos;
            </span>
          )}
          <Link
            href={data?.banner?.mainHeadingLink || "#"}
            className={`${fonts?.cinzel} uppercase block underline text-white text-[45px] font-bold`}
          >
            {data?.banner?.mainHeading}
          </Link>
          <Flex gap={"16px"} className="mt-4">
            {!user && data?.banner?.primaryButton?.label && (
              <Link
                href={data?.banner?.primaryButton?.link || "/get-access"}
                className={` flex items-center gap-1  text-[#303030] text-sm font-medium bg-white leading-4 px-6 mb-2xl:px-4 py-3 rounded-md
            transition-all duration-300 hover:bg-[#303030] hover:text-white
            `}
              >
                {data?.banner?.primaryButton?.label}
              </Link>
            )}
            {data?.banner?.secondaryButton?.label && (
              <Link
                href={data?.banner?.secondaryButton?.link || "#"}
                className={` flex items-center gap-1  text-white text-sm font-medium bg-[#303030] leading-4 px-6 mb-2xl:px-4 py-3 rounded-md  transition-all duration-300 hover:bg-white hover:text-[#303030] group/btn`}
              >
                {user.role === "subscriber"
                  ? "Watch Full Video"
                  : data?.banner?.secondaryButton?.label}
                {data?.banner?.secondaryButton?.icon && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    className="fill-white transition-all duration-300 block group-hover/btn:fill-[#303030]"
                  >
                    <path d="M360-272.31v-415.38L686.15-480 360-272.31Z" />
                  </svg>
                )}
              </Link>
            )}
          </Flex>
        </Container>
      </div>
    </div>
  );
};

export default React.memo(MainVideoBanner);
