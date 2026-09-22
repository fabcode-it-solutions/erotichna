"use client";
import PlayButton from "@/assets/icons/PlayButton";
import VideoSkeleton from "@/components/global/Loading/VideoSkeleton/VideoSkeleton";
import TitleDivider from "@/components/global/TitleDivider/TitleDivider";
import VideoPlayer from "@/components/global/videoPlayer/VideoPlayer";
import MuxVideo from "@mux/mux-video-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import PostCard from "./(main)/videos/PostCard";

const TopVideo = ({
  title,
  showAllVideo,
  videos,
  showAllVideoButton,
  query,
}) => {
 
  
  return (
    <div className=" bg-black">
      <TitleDivider title={title || "Videos"} />
      <div className="grid grid-cols-3 max-md-tab:grid-cols-2 max-lg-mb:grid-cols-1  gap-2.5 p-[5px]">
        {!videos &&
          [0, 1, 2, 3, 4, 5].map((item, i) => <VideoSkeleton key={i} />)}
        {videos?.length > 0 &&
          videos.map((item, i) => <PostCard key={i} item={item} />)}
      </div>
      {(showAllVideo?.showAllButton || showAllVideoButton) && (
        <div className="py-2.5 flex justify-center">
          <Link
            href={showAllVideo?.primaryButton?.link || `/videos`}
            className="text-white text-lg leading-none uppercase border-2 border-white px-3 py-2"
          >
            {showAllVideo?.primaryButton?.label || "Show all Videos"}
          </Link>
        </div>
      )}
    </div>
  );
};

export default React.memo(TopVideo);
