/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import GetVideoData from "../GetVideoData/GetVideoData";
import InputDashboard from "../InputDashboard/InputDashboard";
import ToastError from "@/components/global/Toasts/ToastError";
import VideoPlayer from "@/components/global/videoPlayer/VideoPlayer";
import ImageUploader from "../ImageUploader/ImageUploader";
import { createSwapy } from "swapy";
import IconDragDots from "@/assets/icons/IconDragDots";
import ToastSuccess from "@/components/global/Toasts/ToastSuccess";
import useTheme from "@/contexts/theme/ThemeProvider";
import Loader from "@/components/global/Loading/Loader";

const MAX_VIDEOS = 6;

const AddVideos = ({ data, setFormData, field }) => {
  const swapy = useRef(null);
  const { setTopVideosData, fetchData } = useTheme();
  const container = useRef(null);
  const [success, setSuccess] = useState({});
  const [videoData, setVideoData] = useState([]);
  const [error, setError] = useState({});
  const [addVideo, setAddVideo] = useState(false);
  const [orderChanged, setOrderChanged] = useState(false);
  const [loader, setLoader] = useState(false);
  const [editItem, setEditItem] = useState({});
  const [newVideo, setNewVideo] = useState({
    heading: "",
    link: "",
    video: { src: "", poster: "" },
    imageData: null,
  });

  useEffect(() => {
    setVideoData(data || []);
  }, [data]);
  useEffect(() => {
    swapy.current = createSwapy(container.current, {
      swapMode: "hover",
    });
    swapy.current.onSwap((event) => {
      setOrderChanged(true);
    });
  }, []);
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      [field]: { ...prev[field], videosData: videoData },
    }));
    setTimeout(() => {
      if (container.current) {
        swapy.current.update();
      }
    }, 1500);
  }, [videoData]);

  const validateNewVideo = () => {
    const { heading, link, imageData, image } = newVideo;
    let newErrors = {};
    if (!heading) newErrors.heading = "Heading is required.";
    if (!link) newErrors.link = "Link is required.";
    if (!imageData && !image) newErrors.image = "Image is required.";
    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addVideoItem = (e) => {
    e.preventDefault();
    if (videoData.length >= MAX_VIDEOS) {
      setError({ videoLength: true });
      setTimeout(() => setError({}), 5000);
      return;
    }
    if (validateNewVideo()) {
      setVideoData([...videoData, newVideo]);
      setNewVideo({
        heading: "",
        link: "",
        video: { src: "", poster: "" },
        imageData: null,
        image: null,
      });
    }
  };

  const removeVideo = async (_id) => {
    const text = "Are you sure?\n You want to remove the video.";
    if (confirm(text) == true) {
      try {
        const response = await fetch("/api/admin/homepage/remove-top-video", {
          method: "PUT",
          body: JSON.stringify({ _id }),
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        if (data) {
          fetchData("topVideos", setTopVideosData);
        }
      } catch (error) {
      } finally {
      }
    }
  };

  const handleVideoSelection = (videoDetails) => {
    setNewVideo({
      heading: videoDetails.title,
      link: `/videos/${videoDetails.seo.permalink}`,
      video: { src: videoDetails.hoveredVideo?.src },
      image: videoDetails.poster,
    });
  };

  const updateOrder = async (e) => {
    e.preventDefault();
    const orders = swapy.current.slotItemMap().asArray;
    try {
      setLoader(true);
      const response = await fetch("/api/admin/homepage/top-videos-order", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order: orders,
        }),
      });
      const data = await response.json();
      if (!data?.error) {
        setLoader(false);
        setSuccess({
          active: true,
          message: "Order updated successfully. ",
        });
        setOrderChanged(false);
      } else {
        setError({
          active: true,
          message: data.error,
        });
        setLoader(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };
  const editVideoItem = async (e) => {
    e.preventDefault();
    if (validateNewVideo()) {
      try {
        setLoader(true);

        const response = await fetch("/api/admin/homepage/top-videos", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            newVideo,
          }),
        });
        const data = await response.json();
        if (!data?.error) {
          setLoader(false);
          setSuccess({
            active: true,
            message: "Video updated successfully. ",
          });
          setOrderChanged(false);
          fetchData("topVideos", setTopVideosData);
          setAddVideo(false);
          setNewVideo({
            heading: "",
            link: "",
            video: { src: "", poster: "" },
            imageData: null,
            image: null,
          });
        } else {
          setError({
            active: true,
            message: data.error,
          });
          setLoader(false);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoader(false);
      }
    }
  };
  return (
    <div>
      {loader && <Loader message="Updating..." />}
      {error.videoLength && (
        <ToastError message="Only six videos allowed." active />
      )}
      {success?.active && (
        <ToastSuccess
          active={success?.active}
          message={success?.message}
          setSuccess={setSuccess}
        />
      )}
      {error?.active && (
        <ToastError
          active={error?.active}
          message={error?.message}
          setError={setError}
        />
      )}
      {videoData.length === 0 && (
        <p className="text-sm text-center my-6">No video added yet.</p>
      )}
      <label className="text-sm mt-3 block font-satoshi font-medium">
        Add Video
      </label>
      <button
        type="button"
        className="w-full text-center py-3 border-dashed mb-6 border border-black border-opacity-20  rounded-2xl mt-3 text-sm font-satoshi"
        onClick={() => {
          setAddVideo((prev) => !prev);
          setEditItem({});
        }}
      >
        {!addVideo ? "+ Add Video" : "Cancel"}
      </button>
      {addVideo && (
        <form
          onSubmit={(e) =>
            editItem?.heading ? editVideoItem(e) : addVideoItem(e)
          }
          className="bg-warm p-4 mb-4 flex flex-col gap-2 rounded-lg mt-3"
        >
          <label className=" text-[#232323] text-sm font-medium font-satoshi leading-[19px] mb-3 block">
            {editItem?.heading
              ? "Edit via a Video (automatic)"
              : "Add via a Video (automatic)"}
          </label>
          <GetVideoData
            setVideoDetails={handleVideoSelection}
            value={editItem?.heading}
          />
          <div className="my-3 relative">
            <div className="bg-black bg-opacity-15 w-full h-[1px]"></div>
            <div className="bg-warm px-2 text-sm text-black absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 ">
              Or
            </div>
          </div>
          <label className=" text-[#232323] text-base font-medium font-satoshi leading-[19px] mb-3 block">
            {editItem?.heading ? "Edit manually" : "Add manually"}
          </label>
          <InputDashboard
            label={editItem?.heading ? "Edit Heading*" : "Add Heading*"}
            value={newVideo.heading || editItem?.heading || ""}
            setInputData={(e) =>
              setNewVideo({ ...newVideo, heading: e.target.value })
            }
          />
          {error.heading && (
            <p className="text-red-500 text-sm">{error.heading}</p>
          )}

          <InputDashboard
            label={editItem?.link ? "Edit Link*" : "Add Link*"}
            value={newVideo.link || editItem?.link || ""}
            setInputData={(e) =>
              setNewVideo({ ...newVideo, link: e.target.value })
            }
          />
          {error.link && <p className="text-red-500 text-sm">{error.link}</p>}

          <InputDashboard
            label={editItem?.link ? "Edit Video ID*" : "Add Video ID*"}
            value={newVideo.video.src || editItem?.video?.src || ""}
            setInputData={(e) =>
              setNewVideo({ ...newVideo, video: { src: e.target.value } })
            }
          />
          {(newVideo.video.src || editItem?.video?.src) && (
            <VideoPlayer
              videoId={newVideo.video.src || editItem?.video?.src}
              className="aspect-video mt-3"
            />
          )}

          <ImageUploader
            exportImage={(name, src, main) =>
              setNewVideo({
                ...newVideo,
                imageData: { name, src },
                image: main,
              })
            }
            id="topVideosImageUploader"
            prevImage={
              newVideo.image?.replace(
                "https://storage.bunnycdn.com/assets-erotichna",
                "https://files-erotichna.b-cdn.net"
              ) ||
              editItem?.image?.replace(
                "https://storage.bunnycdn.com/assets-erotichna",
                "https://files-erotichna.b-cdn.net"
              ) ||
              ""
            }
          />
          {error.image && <p className="text-red-500 text-sm">{error.image}</p>}

          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded-lg mt-3"
          >
            {editItem?.heading ? "Update" : "Save"}
          </button>
        </form>
      )}
      {videoData && videoData.length > 0 && (
        <label className="text-lg font-satoshi font-medium mb-3 flex justify-between items-center">
          Videos
          <div className="flex gap-2">
            {orderChanged && (
              <button
                onClick={(e) => updateOrder(e)}
                type="button"
                className="text-center py-3 max-lg-mb:mt-2 bg-black  text-white px-5 rounded-lg text-sm font-satoshi"
              >
                Update Order
              </button>
            )}
            {orderChanged && (
              <button
                onClick={(e) => setOrderChanged(false)}
                type="button"
                className="text-center py-3  max-lg-mb:mt-2  max-lg-mb:ml-2 bg-red-500  text-white px-5 rounded-lg text-sm font-satoshi"
              >
                Cancel
              </button>
            )}
          </div>
        </label>
      )}
      <div className="flex top-videos-grid flex-wrap gap-3" ref={container}>
        {videoData.map((item, index) => (
          <div
            key={index}
            data-swapy-slot={index + 1}
            className="bg-warm rounded-lg relative w-full max-w-[calc(33.33%-8px)]"
          >
            <div data-swapy-item={item._id} className="bg-warm rounded-lg p-3">
              <div className="relative">
                <button
                  data-swapy-handle
                  className="absolute top-4 left-4 z-[2]"
                >
                  <IconDragDots
                    className="fill-white"
                    opacity={1}
                    fillColor="#fff"
                  />
                </button>
                <div className="absolute rounded-lg  top-0 left-0 z-[1] from-[rgba(0,0,0,0.2)] to-[rgba(0,0,0,0.5)] bg-gradient-to-b  w-full h-full"></div>
                <Image
                  src={
                    item.image?.replace(
                      "https://storage.bunnycdn.com/assets-erotichna",
                      "https://files-erotichna.b-cdn.net"
                    ) || "/assets/images/placeholder-light.png"
                  }
                  width={1280}
                  unoptimized={true}
                  height={720}
                  className="rounded-lg  object-cover"
                  alt="Thumbnail"
                />
              </div>
              <div className="absolute flex justify-between gap-2 w-full items-center p-6 bottom-0 left-0 z-[1]">
                <span className="text-white text-lg font-semibold ">
                  {item.heading}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setEditItem(item);
                      setNewVideo(item);
                      setAddVideo(true);
                    }}
                    type="button"
                    className="bg-black text-sm max-w-[130px] items-center justify-center text-white font-medium
                         px-4 py-1 min-w-[39px] min-h-[39px]   transition-all duration-300 hover:bg-[#ff4040] hover:text-white 
                         w-full flex gap-2 rounded-lg
               
              "
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removeVideo(item._id)}
                    className="bg-[#ff4040]  text-sm max-w-[130px] items-center justify-center text-white font-medium
                         px-4 py-1 min-w-[39px] min-h-[39px]   transition-all duration-300 hover:bg-[#ff4040] hover:text-white 
                         w-full flex gap-2 rounded-lg"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddVideos;
