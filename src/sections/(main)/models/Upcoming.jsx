import TitleDivider from "@/components/global/TitleDivider/TitleDivider";
import React from "react";
import MuxVideo from "@mux/mux-video-react";
import Link from "next/link";
import PlayButton from "@/assets/icons/PlayButton";
import { Container, Flex } from "@radix-ui/themes";
import Image from "next/image";
import VideoPlayer from "@/components/global/videoPlayer/VideoPlayer";

const UpcomingScene = ({ data, title }) => {
  return (
    <div>
      <TitleDivider title={title} />
      <div className="w-full relative group/banner">
        <Link
          href={"/videos/hotel-vixen-season-2-episode-1-rebound-9697"}
          className="transition-all z-[2] w-[117px] h-[117px] duration-300 opacity-0 group-hover/banner:opacity-100 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <PlayButton />
        </Link>
        <Image
          src={
            data?.upcoming_scene_thumbnail_image?.replace(
              "https://storage.bunnycdn.com/assets-erotichna",
              "https://files-erotichna.b-cdn.net"
            ) || "/assets/images/placeholder-dark.png"
          }
          width={1920}
          height={792}
          unoptimized={true}
          alt="upcoming_scene_thumbnail_image"
          className="w-full h-full object-cover opacity-100 absolute top-0 left-0 transition-all duration-300 group-hover/banner:opacity-0"
        />
        <VideoPlayer videoId={data?.upcoming_scene_video} />
      </div>
    </div>
  );
};

export default UpcomingScene;
