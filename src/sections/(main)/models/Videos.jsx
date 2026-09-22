"use client";
import PlayButton from "@/assets/icons/PlayButton";
import TitleDivider from "@/components/global/TitleDivider/TitleDivider";
import VideoPlayer from "@/components/global/videoPlayer/VideoPlayer";
import MuxVideo from "@mux/mux-video-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import PostCard from "../videos/PostCard";

const TopVideo = ({ title, showAllVideo, videos }) => {
  return (
    <div className={` bg-black `}>
      <TitleDivider title={title || "Videos"} />
      <div className="grid min-3xl:grid-cols-3 gap-2.5 p-[5px]">
        {videos?.length > 0 &&
          videos.map((item, i) => (
            <PostCard key={i} item={item} />          
          ))}
      </div>
      {showAllVideo?.showAllButton && (
        <div className="py-2.5 flex justify-center">
          <Link
            href={showAllVideo?.primaryButton?.link || "#"}
            className="text-white text-lg leading-none uppercase border-2 border-white px-3 py-2"
          >
            {showAllVideo?.primaryButton?.label}
          </Link>
        </div>
      )}
    </div>
  );
};

export default TopVideo;
