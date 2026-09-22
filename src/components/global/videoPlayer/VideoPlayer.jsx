import BunnyHLSPlayer from "@/app/(main)/BunnyHLSPlayer";
import { useIsMobile } from "@/utils/useIsMobile";
import React from "react";
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

const VideoPlayer = ({
  videoId,
  autoplay,
  loop,
  className,
  muted = true,
  startLevel,
  startLevelMobile,
  iframe = false,
  controls = false,
  videoPlayerStyle,
}) => {
  const isMobile = useIsMobile();
  return !iframe ? (
    <iframe
      data-id={videoId}
      className={` w-full  ${className || ""}`}
      src={
        videoId && videoId.includes("mediadelivery")
          ? `${videoId}?autoplay=${autoplay || "true"}&loop=${
              loop || "true"
            }&muted=true&preload=true&responsive=true`
          : `https://iframe.mediadelivery.net/embed/${process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID}/${videoId}?autoplay=${
              autoplay || "true"
            }&loop=${loop || "true"}&muted=${
              muted || "true"
            }&preload=true&responsive=true`
      }
      loading="lazy"
      allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
      allowFullScreen
    ></iframe>
  ) : (
    <div className={` w-full h-full ${className || ""}`}>
      <BunnyHLSPlayer
        src={`https://${process.env.NEXT_PUBLIC_BUNNY_PULL_ZONE}.b-cdn.net/${videoId}`}
        autoPlay={true}
        videoId={videoId}
        muted={muted}
        controls={controls || false}
        videoPlayerStyle={videoPlayerStyle || ""}
        startLevel={isMobile ? startLevelMobile || -1 : startLevel}
      />
    </div>
  );
};

export default VideoPlayer;
