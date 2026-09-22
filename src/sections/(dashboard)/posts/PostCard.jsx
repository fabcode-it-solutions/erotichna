"use client";
import IconCalander from "@/assets/icons/IconCalander";
import IconDelete from "@/assets/icons/IconDelete";
import IconView from "@/assets/icons/Iconview";
import IconWatch from "@/assets/icons/IconWatch";
import PlayButton from "@/assets/icons/PlayButton";
import Anchor from "@/components/global/Anchor/Anchor";
import VideoPlayer from "@/components/global/videoPlayer/VideoPlayer";
import useAdmin from "@/contexts/admin/AdminDataProvider";
import useAuth from "@/contexts/auth/AuthProvider";
import { getFormattedPublishDate } from "@/utils/getDate";
import MuxVideo from "@mux/mux-video-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const PostCard = ({ item, limit, skip, filterStatus, getVideos }) => {
  const { user } = useAuth();
  const { getAllPosts } = useAdmin();
  const [btnLoading, setBtnLoading] = useState(false);
  const [success, setSuccess] = useState({
    active: false,
    message: "",
  });
  const [error, setError] = useState({
    active: false,
    message: "",
  });
  const trashVideo = async () => {
    const text = "Are you sure?\n You want to delete the Video?";
    if (confirm(text) == true) {
      try {
        const response = await fetch(`/api/admin/post`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-token": user.userID,
          },
          body: JSON.stringify({
            _id: item._id,
            status: "trash",
          }),
        });
        const data = await response.json();

        if (!data.error) {
          setBtnLoading(false);
          setSuccess({
            active: true,
            message: `Model is successfully ${status}.`,
          });
          getAllPosts(limit, skip, filterStatus, "admin");
          if (getVideos) {
            getVideos();
          }
        } else {
          setBtnLoading(false);
          setError({
            active: true,
            message: data.error,
          });
        }
      } catch (error) {
        setBtnLoading(false);
        setError({
          active: true,
          message: "Something went wrong! Please try again later.",
        });
      } finally {
        setBtnLoading(false);
      }
    }
  };
  return (
    <div className=" bg-white p-2 w-full border border-stroke rounded-lg relative ">
      <div className="w-full relative group/banner pb-[56.05%] rounded-lg overflow-hidden ">
        <div className="transition-all duration-500 opacity-0 z-[3] w-full h-full hidden items-center justify-center  group-hover/banner:opacity-100 absolute top-0 left-0">
          <PlayButton className="w-[74px] h-[74px]" />
        </div>
        <Image
          src={
            item?.poster?.replace(
              "https://storage.bunnycdn.com/assets-erotichna",
              "https://files-erotichna.b-cdn.net"
            ) || "/assets/images/placeholder-dark.png"
          }
          width={900}
          height={600}
          unoptimized={true}
          className="w-full h-full object-cover absolute rounded-lg top-0 left-0 z-[1] transition-all duration-500 opacity-100 "
          alt="Image"
        />
        <VideoPlayer
          videoId={item?.hoveredVideo?.src}
          className="absolute top-0 left-0 hidden  h-full w-full transition-all duration-500 opacity-0  group-hover/banner:opacity-100"
        />
      </div>
      <div className="mt-3">
        <div className=" text-[#151516] text-base font-medium font-satoshi leading-5 tracking-[-0.14px]">
          {item?.title}
        </div>
        <div className="flex gap-[15px] mt-3">
          <span className="text-[#7f7f7f] text-xs font-normal font-satoshi leading-3 flex items-center gap-2">
            <IconView className="w-4 h-4" />
            <span className="text-[#232323]">{item?.videoView}</span>
          </span>
          {item?.video?.duration && (
            <span className="text-[#7f7f7f] text-xs font-normal font-satoshi leading-3 flex items-center gap-2">
              <IconWatch className="w-4 h-4" />
              <span className="text-[#232323]">{item?.video.duration}</span>
            </span>
          )}
          <span className="text-[#7f7f7f] text-xs font-normal font-satoshi leading-3 flex items-center gap-2">
            <IconCalander className="w-4 h-4 fill-[#242424]" />
            <span className="text-[#232323]">
              {getFormattedPublishDate(item?.createdAt)}
            </span>
          </span>
        </div>

        <div className="flex gap-2 w-full left-0  mt-2 ">
          <Anchor
            label="Edit"
            className="rounded-lg !bg-black hover:!text-white !w-full"
            href={`/dashboard/videos/edit/${item?.seo.permalink}`}
          />
          <Link
            className="rounded-lg border border-main-black min-w-12 max-lg-mb:min-h-12 flex justify-center items-center"
            href={`/videos/${item?.seo.permalink}`}
          >
            <IconView className="w-4 h-4" />
          </Link>
          <button
            onClick={() => trashVideo(item._id)}
            className="bg-red-500  min-w-12 max-lg-mb:min-h-12 rounded-lg flex items-center justify-center"
          >
            <IconDelete className="fill-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
