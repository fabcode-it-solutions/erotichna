"use client";
import TitleDivider from "@/components/global/TitleDivider/TitleDivider";
import React, { useState } from "react";
import MuxVideo from "@mux/mux-video-react";
import Link from "next/link";
import PlayButton from "@/assets/icons/PlayButton";
import { Box, Container, Flex } from "@radix-ui/themes";
import Image from "next/image";
import VideoPlayer from "@/components/global/videoPlayer/VideoPlayer";
import useTheme from "@/contexts/theme/ThemeProvider";
import { useIsMobile } from "@/utils/useIsMobile";

const UpcomingScene = ({ data }) => {
  const { fonts } = useTheme();
  const [email, setEmail] = useState("");
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
    <div className={data?.video?.mobileLink ? "mobile-video-active" : ""}>
      <div
        className="w-full relative group/banner max-lg-mb:pb-[120vw] overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <div className="absolute top-1/2 -translate-y-1/2 left-[5%] z-[9] max-lg-mb:top-auto max-lg-mb:bottom-0 max-lg-mb:left-1/2 max-lg-mb:-translate-x-1/2 max-lg-mb:translate-y-0 max-lg-mb:w-full max-lg-mb:flex max-lg-mb:flex-col max-lg-mb:items-center max-lg-mb:text-center max-lg-mb:p-4">
          <div
            className={` text-white font-bold uppercase text-7xl max-w-[550px] max-lg-mb:text-4xl ${fonts.cinzel} `}
          >
            Coming up next!
          </div>
          <div className="py-4 my-4 border-y-4 border-white max-lg-mb:my-2 max-lg-mb:py-2 max-lg-mb:border-y-2">
            <div
              className={`text-white uppercase text-3xl max-w-[413px] max-lg-mb:text-lg max-lg-mb:max-w-[231px]  ${fonts.oswald}`}
            >
              get update and be know first. join Our Newsletter
            </div>
          </div>
          <Box className="max-w-[550px] w-full bg-white p-4 bg-opacity-70 backdrop-blur-md">
            <h4 className="text-dark-150 text-lg font-medium">Newsletter</h4>
            <div className="relative omnisend-embedded-from omnisend-embedded-from-dark ">
              <div id="omnisend-embedded-v2-67935ef33f123c4f0ae504aa"></div>
            </div>
          </Box>
        </div>
        <Image
          src={
            data?.cover?.replace(
              "https://storage.bunnycdn.com/assets-erotichna",
              "https://files-erotichna.b-cdn.net"
            ) || "/assets/images/placeholder-dark.png"
          }
          width={1920}
          unoptimized={true}
          height={792}
          alt="Upcoming Scene"
          // className="w-full h-full absolute top-0 left-0 object-cover opacity-100 transition-all duration-300 group-hover/banner:opacity-0"
          className={`w-full h-full absolute top-0 left-0 object-cover opacity-100 transition-all duration-300 group-hover/banner:opacity-0 ${
            isMobile ? (isPlaying ? "opacity-0" : "opacity-100") : ""
          }`}
        />
        <VideoPlayer
          videoId={data?.video?.link}
          startLevelMobile={2}
          // className={`opacity-0 aspect-video transition-all duration-300 group-hover/banner:opacity-100 max-lg-mb:absolute max-lg-mb:w-auto max-lg-mb:h-full max-lg-mb:top-0 max-lg-mb:left-0 max-lg-mb:-translate-x-1/2
          //   ${data?.video?.mobileLink ? "max-lg-mb:!hidden" : ""}
          //   `}
          className={`opacity-0 aspect-video transition-all duration-300 group-hover/banner:opacity-100 max-lg-mb:absolute max-lg-mb:w-auto max-lg-mb:h-full max-lg-mb:top-0 max-lg-mb:left-0 max-lg-mb:-translate-x-1/2 ${
            isMobile ? (isPlaying ? "opacity-100" : "opacity-0") : ""
          } ${data?.video?.mobileLink ? "max-lg-mb:!hidden" : ""}`}
        />

        <VideoPlayer
          videoId={data?.video?.mobileLink}
          startLevelMobile={2}
          // className={`opacity-0 mobile-video-up aspect-video transition-all duration-300 group-hover/banner:opacity-100 max-lg-mb:absolute max-lg-mb:w-auto max-lg-mb:h-full max-lg-mb:top-0 max-lg-mb:left-0 max-lg-mb:-translate-x-1/2
          //   ${data?.video?.mobileLink ? "!hidden max-lg-mb:!block" : "!hidden"}
          //   `}
          className={`opacity-0 mobile-video-up aspect-video transition-all duration-300 group-hover/banner:opacity-100 max-lg-mb:absolute max-lg-mb:w-auto max-lg-mb:h-full max-lg-mb:top-0 max-lg-mb:left-0 max-lg-mb:-translate-x-1/2 ${
            isMobile ? (isPlaying ? "opacity-100" : "opacity-0") : ""
          } ${
            data?.video?.mobileLink ? "!hidden max-lg-mb:!block" : "!hidden"
          }`}
        />
      </div>
    </div>
  );
};

export default UpcomingScene;
