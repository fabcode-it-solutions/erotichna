/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";
import React, { useEffect, useRef, useState } from "react";
import PlayButton from "@/assets/icons/PlayButton";
import IconClose from "@/assets/icons/IconClose";
import useTheme from "@/contexts/theme/ThemeProvider";
import TopVideo from "@/sections/TopVideo";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import TitleDivider from "@/components/global/TitleDivider/TitleDivider";
import Link from "next/link";
import IconWatch from "@/assets/icons/IconWatch";
import Comments from "./Comments";
import Image from "next/image";
import VideoPlayer from "@/components/global/videoPlayer/VideoPlayer";
import useAuth from "@/contexts/auth/AuthProvider";
import IconView from "@/assets/icons/Iconview";
import Rating from "@/components/global/Rating/Rating";
import { notFound, usePathname, useRouter } from "next/navigation";
import IconArrowBackword from "@/assets/icons/IconArrowBackword";
import IconArrowForward from "@/assets/icons/IconArrowForward";
import WishlistButton from "@/components/wishlist/button/WishlistButton";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Download } from "lucide-react";

const Index = ({ slug, videoData }) => {
  const { user } = useAuth();
  const path = usePathname();
  const router = useRouter();
  const { bannerData, topVideosData } = useTheme();
  const SliderRef = useRef(null);
  const [showPopup, setShowPopUp] = useState(false);
  const [data, setData] = useState(null);
  const [videoLink, setVideoLink] = useState("");
  const [trailer, setTrailer] = useState(false);
  const [haveSub, setHaveSub] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [listed, setListed] = useState(false);
  const [videoRating, setVideoRating] = useState(0);
  const [downloadingAll, setDownloadingAll] = useState(false);
  const [showAllGallery, setShowAllGallery] = useState(false);
  const [thumbnailLoaded, setThumbnailLoaded] = useState({});
  const [thumbError, setThumbError] = useState({});

  // Handle restriction for dev tools
  // useEffect(() => {
  //   // Disable right-click
  //   const handleContextMenu = (e) => e.preventDefault();

  //   // Disable F12, Ctrl+Shift+I/C/J, Ctrl+U
  //   const handleKeyDown = (e) => {
  //     // F12
  //     if (e.key === "F12" || e.code === "F12" || e.keyCode === 123)
  //       e.preventDefault();

  //     // Ctrl+Shift+I/J/C
  //     if (e.ctrlKey && e.shiftKey) {
  //       const blockedKeys = ["I", "J", "C"];
  //       if (
  //         blockedKeys.includes(e.key.toUpperCase()) ||
  //         blockedKeys.includes(e.code.slice(-1))
  //       ) {
  //         e.preventDefault();
  //       }
  //     }

  //     // Ctrl+U
  //     if (e.ctrlKey && (e.key.toUpperCase() === "U" || e.code === "KeyU"))
  //       e.preventDefault();
  //   };

  //   // Prevent dragging images
  //   const handleDragStart = (e) => e.preventDefault();

  //   // Apply globally
  //   document.addEventListener("contextmenu", handleContextMenu);
  //   document.addEventListener("keydown", handleKeyDown);
  //   document.addEventListener("dragstart", handleDragStart);

  //   // Optional: Prevent selection (text/images)
  //   document.addEventListener("selectstart", (e) => e.preventDefault());

  //   return () => {
  //     document.removeEventListener("contextmenu", handleContextMenu);
  //     document.removeEventListener("keydown", handleKeyDown);
  //     document.removeEventListener("dragstart", handleDragStart);
  //     document.removeEventListener("selectstart", (e) => e.preventDefault());
  //   };
  // }, []);

  // Handle Single Image download
  const handleDownloadImage = async (url, name) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const objUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objUrl;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objUrl);
    } catch (e) {}
  };

  // Handle Download All
  // const handleDownloadAll = async () => {
  //   if (!data?.gallery || data.gallery.length === 0) return;
  //   setDownloadingAll(true);
  //   try {
  //     const zip = new JSZip();
  //     for (let i = 0; i < data.gallery.length; i++) {
  //       const original =
  //         data.gallery[i]?.replace(
  //           "https://storage.bunnycdn.com/assets-erotichna",
  //           "https://files-erotichna.b-cdn.net"
  //         ) || "/assets/images/placeholder-dark.png";
  //       const res = await fetch(original);
  //       const blob = await res.blob();
  //       const ext = blob.type.split("/")[1] || "jpg";
  //       const name = `${data?.seo?.permalink || data?.title || "image"}-${
  //         i + 1
  //       }.${ext}`;
  //       zip.file(name, blob);
  //     }
  //     const zipBlob = await zip.generateAsync({ type: "blob" });
  //     saveAs(zipBlob, `${data?.seo?.permalink || "gallery"}.zip`);
  //   } catch (e) {
  //   } finally {
  //     setDownloadingAll(false);
  //   }
  // };

  const handleDownloadAll = async () => {
    if (!data?.gallery || data.gallery.length === 0) return;
    setDownloadingAll(true);
    try {
      const zip = new JSZip();
      for (let i = 0; i < data.gallery.length; i++) {
        const url = data.gallery[i];

        // SKIP blob: URLs
        if (url.startsWith("blob:")) continue;

        const original =
          url.replace(
            "https://storage.bunnycdn.com/assets-erotichna",
            "https://files-erotichna.b-cdn.net"
          ) || "/assets/images/placeholder-dark.png";

        console.log("Downloading URL:", original);

        const res = await fetch(original);
        const blob = await res.blob();
        const ext = blob.type.split("/")[1] || "jpg";
        const name = `${data?.seo?.permalink || data?.title || "image"}-${
          i + 1
        }.${ext}`;
        zip.file(name, blob);
      }
      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, `${data?.seo?.permalink || "gallery"}.zip`);
    } catch (e) {
      console.log("Download error:", e);
    } finally {
      setDownloadingAll(false);
    }
  };

  const handlePlayButtonClick = () => {
    setShowPopUp(true);
  };

  const handleClosePopup = () => {
    setShowPopUp(false);
  };
  const getRating = async (videoId) => {
    try {
      const response = await fetch(
        `/api/admin/post/rating?id=${videoId}&type=video`
      );
      const data = await response.json();
      if (data.rating) {
        setVideoRating(data.rating);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getUserRating = async (videoId) => {
    try {
      const response = await fetch(
        `/api/admin/post/user-rating?videoId=${videoId}&userId=${user._id}`
      );
      const data = await response.json();
      if (!data?.error) {
        if (data.count > 0) {
          setShowRating(false);
        } else {
          setShowRating(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const setRating = async (index, videoId) => {
    try {
      setShowRating(false);
      const response = await fetch("/api/admin/post/rating", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-token": user.userID },
        body: JSON.stringify({
          userId: user._id,
          videoId: videoId,
          rating: index,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setVideoRating(data.rating);
        getUserRating(videoId);
      }
    } catch (error) {}
  };

  useEffect(() => {
    setData(videoData.data);
    setListed(videoData.isInWishlist);
    if (user && user.role != "customer") {
      setShowPopUp(false);
      setHaveSub(true);
      setVideoLink(videoData.data.video?.src);
    } else {
      if (bannerData?.banner?.secondaryButton?.link == path) {
        setShowPopUp(false);

        setTrailer(true);
        setVideoLink(videoData.data.trailer?.src);
      }
      if (
        bannerData?.banner?.secondaryButton?.link &&
        bannerData?.banner?.secondaryButton?.link != path
      ) {
        if (!trailer) {
          setShowPopUp(true);
        }
        setTrailer(false);
        setVideoLink(videoData.data.hoveredVideo?.src);
      }
    }
    getRating(videoData.data?._id);
    if (user && user.role != "customer") {
      getUserRating(videoData.data?._id);
    }
  }, [videoData, user, bannerData]);
  useEffect(() => {
    if (trailer) {
      setTimeout(() => {
        const video = document.querySelector("#trailer-video");
        if (video) {
          video.addEventListener("ended", (event) => {
            setShowPopUp(true);
          });
        }
      }, 1000);
    }
  }, [trailer]);
  useEffect(() => {
    const lightbox = new PhotoSwipeLightbox({
      gallery: "#gallery",
      children: "a",
      pswpModule: () => import("photoswipe"),
    });

    lightbox.init();
  }, []);

  return (
    <div className="bg-black">
      <div className="md:max-w-[80%] px-4 mx-auto">
        <div className="flex justify-center pt-[120px] relative">
          <div className="w-full relative group/banner rounded-lg overflow-hidden">
            {showPopup && (
              <div className="absolute inset-0 flex z-[91] justify-center items-center bg-gray-900 bg-opacity-0">
                <div className="bg-black text-white p-6 rounded-lg text-center w-[80%] md:w-[400px] max-lg-mb:p-2 max-lg-mb:pb-6 bg-opacity-50 backdrop-blur-sm">
                  <div
                    className="flex  justify-end py-2 cursor-pointer"
                    onClick={handleClosePopup}
                  >
                    <IconClose className={"fill-white"} stroke={"white"} />
                  </div>
                  <h2 className="text-xl font-bold mb-4 max-lg-mb:text-sm max-lg-mb:mb-2">
                    You need to buy a subscription to play full video.
                  </h2>
                  <Link
                    href="/get-access"
                    className="text-white bg-red-500 hover:bg-white hover:text-black w-[80%] mx-auto py-3 flex justify-center uppercase font-satoshi cursor-pointer"
                  >
                    Buy Subscription
                  </Link>
                </div>
              </div>
            )}

            {data?.poster ? (
              <div
                onClick={handlePlayButtonClick}
                className={`transition-all duration-500  z-[3] w-full h-full flex items-center justify-center   absolute top-0 left-0
                 ${haveSub ? "pointer-events-none hidden" : ""}
                  ${
                    trailer
                      ? "opacity-0 hidden"
                      : "group-hover/banner:opacity-100 "
                  }
                  `}
              >
                <PlayButton className="w-[74px] h-[74px]" />
              </div>
            ) : (
              ""
            )}
            {data?.poster ? (
              <Image
                src={
                  data?.poster?.replace(
                    "https://storage.bunnycdn.com/assets-erotichna",
                    "https://files-erotichna.b-cdn.net"
                  ) || "/assets/images/placeholder-dark.png"
                }
                width={1920}
                height={1080}
                unoptimized={true}
                className={`w-full h-full object-cover absolute rounded-lg top-1/2 -translate-x-1/2 -translate-y-1/2 left-1/2 z-[1] transition-all duration-500 
                  ${haveSub ? "hidden" : ""}     
                  ${
                    trailer
                      ? "opacity-0 hidden"
                      : "opacity-100  group-hover/banner:opacity-0 group-hover/banner:pointer-events-none"
                  }
                  `}
                alt={`${data?.title ? data.title + " poster" : "Video poster"}`}
              />
            ) : (
              <div
                role="status"
                className="flex items-center justify-center h-full w-full absolute top-0 left-0  bg-dark-150 rounded-lg animate-pulse "
              >
                <div role="status">
                  <svg
                    className="w-8 h-8 animate-spin text-gray-600 fill-custom-red"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            )}
            {!trailer && videoLink ? (
              <VideoPlayer
                loop={trailer ? "false" : ""}
                videoId={videoLink}
                startLevel={2}
                muted={false}
                controls={true}
                title={`${data?.title ? data.title + " video" : "Video"}`}
                className={`aspect-video transition-all duration-500 main-video
                  ${haveSub ? "!opacity-100" : ""}     
                              ${
                                trailer
                                  ? "opacity-100"
                                  : "opacity-0 group-hover/banner:opacity-100"
                              }
                  `}
              />
            ) : trailer && bannerData?.banner?.trailer?.src ? (
              <div className={`aspect-video bg-dark-150 `}>
                <VideoPlayer
                  startLevel={2}
                  videoId={videoLink}
                  controls={true}
                  muted={false}
                  title={`${data?.title ? data.title + " video" : "Video"}`}
                  className={`aspect-video transition-all duration-500 main-video
                              ${
                                trailer
                                  ? "opacity-100"
                                  : "opacity-0 group-hover/banner:opacity-100"
                              }
                  `}
                />
                <video
                  controlsList="nodownload"
                  id="trailer-video"
                  className="w-full !hidden aspect-video h-auto bg-dark-150"
                  name="media"
                  controls
                  playsInline
                  muted
                  autoPlay
                >
                  <source
                    src={bannerData?.banner?.trailer?.src?.replace(
                      "https://storage.bunnycdn.com/assets-erotichna",
                      "https://files-erotichna.b-cdn.net"
                    )}
                  />
                </video>
              </div>
            ) : (
              <div className="aspect-video"></div>
            )}
          </div>
        </div>
        <div className="flex flex-col md:max-w-[80%] mx-auto">
          <div className="text-text-secondary flex py-[20px]">
            <Link className="hover:text-white cursor-pointer" href={"/"}>
              Home
            </Link>{" "}
            &nbsp; / &nbsp;
            <Link className="hover:text-white cursor-pointer" href={"/videos"}>
              Videos
            </Link>{" "}
            &nbsp; / &nbsp;
            <div className="text-white ">{data?.title}</div>
          </div>

          <div className="">
            <div className="flex justify-between gap-6 items-center max-lg-mb:flex-wrap">
              <div className="text-white text-xl font-bodoni flex items-center gap-2">
                {/* <div onClick={handlePlayButtonClick}>
                  <PlayButton
                    className={
                      "w-[80px] h-[80px]  hover:fill-text-input fill-white cursor-pointer"
                    }
                  />
                </div> */}
                <div className="">
                  <div className="text-3xl text-white font-gambetta flex justify-between gap-5">
                    {data?.title}{" "}
                    <WishlistButton
                      listed={listed}
                      id={data?.id}
                      type={"video"}
                    />
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {data &&
                      data?.model?.length > 0 &&
                      data.model.map((item, i) => (
                        <div key={i} className="flex gap-1">
                          {i > 0 && (
                            <span
                              className={` uppercase block  text-white text-base font-semibold`}
                            >
                              &
                            </span>
                          )}
                          <Link
                            href={item.link || "#"}
                            className={` uppercase block  text-[#f6cbc7] text-base font-semibold`}
                          >
                            {item.name}
                          </Link>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-white uppercase text-xl whitespace-nowrap font-semibold">
                  <svg
                    className="text-yellow w-5 h-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 20"
                  >
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                  </svg>{" "}
                  Rating: {videoRating * 2}
                  {/* <Rating videoId={data?._id} /> */}
                </div>
                {showRating && (
                  <div className="flex items-center gap-2 text-white">
                    Add Rating:{" "}
                    <Rating
                      videoId={data?._id}
                      getRating={(e) => setRating(e, data?._id)}
                    />
                  </div>
                )}
              </div>
            </div>
            {data?.description && (
              <div className="text-white text-base leading-6 py-4 border-y border-dark-150 my-4">
                <div dangerouslySetInnerHTML={{ __html: data?.description }} />
              </div>
            )}
            {data?.directedBy && (
              <div className="text-white text-base leading-6 pb-4 border-b border-dark-150 my-4">
                Directed By: {data?.directedBy}
              </div>
            )}
            <div className="flex items-center">
              {data?.video?.duration && (
                <div className="flex items-center gap-2 pr-2 pl-0">
                  <IconWatch stroke="#6b7280" className="w-4 h-4" />
                  <div className="text-gray-500 leading-none">
                    {data?.video?.duration}
                  </div>
                </div>
              )}

              {data?.videoView && (
                <div className="flex items-center gap-2 pl-2 border-l border-gray-500">
                  <IconView stroke="#6b7280" className="w-4 h-4" />
                  <div className="text-gray-500 leading-none">
                    {data?.videoView}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {data?.gallery?.length > 0 && (
          <div className="py-[40px]">
            <TitleDivider title={"Thumbnails"} />
            {/* <div className="swiper-container text-white video-detal-slider relative px-0 gallery-swiper py-[10px] ">
              <div
                className="absolute py-6  top-1/2 -translate-y-1/2 left-0  cursor-pointer hover:bg-transparent z-[2] bg-black bg-opacity-20 backdrop-blur-sm"
                onClick={() => SliderRef.current?.slidePrev()}
              >
                <IconArrowBackword
                  className={"fill-white h-[36px]  w-[36px]"}
                />
              </div>

              <div
                className="py-6 absolute top-1/2 -translate-y-1/2 right-0 cursor-pointer z-[2]  hover:bg-transparent bg-black bg-opacity-20 backdrop-blur-sm"
                onClick={() => SliderRef.current?.slideNext()}
              >
                <IconArrowForward className={"fill-white h-[36px]  w-[36px]"} />
              </div>
              <Swiper
                ref={SliderRef}
                spaceBetween={4}
                slidesPerView={4}
                navigation={true}
                pagination={{ clickable: true }}
                loop={true}
                autoplay={{ delay: 2500, disableOnInteraction: false }}
                onSwiper={(swiper) => {
                  SliderRef.current = swiper;
                }}
                breakpoints={{
                  320: {
                    slidesPerView: 1,
                  },
                  480: {
                    slidesPerView: 2,
                  },
                  768: {
                    slidesPerView: 3,
                  },
                  1024: {
                    slidesPerView: 4,
                  },
                }}
              >
                {data &&
                  data.gallery.map((slide, index) => {
                    return (
                      <SwiperSlide key={index}>
                        <div className="slide-content">
                          <Image
                            src={
                              slide?.replace(
                                "https://storage.bunnycdn.com/assets-erotichna",
                                "https://files-erotichna.b-cdn.net"
                              ) || "/assets/images/placeholder-dark.png"
                            }
                            alt={`${
                              data?.title
                                ? data.title + " gallery image " + (index + 1)
                                : "Gallery image " + (index + 1)
                            }`}
                            unoptimized={true}
                            width={1200}
                            height={800}
                            className="swiper-image h-auto aspect-video"
                          />
                        </div>
                      </SwiperSlide>
                    );
                  })}
              </Swiper>
            </div> */}
            {/* Thumbnail Grid */}
            <div className="flex justify-between items-center py-2">
              <div className="text-white text-lg uppercase leading-none">
                {data?.gallery?.length} images
              </div>
              {user && haveSub && (
                <button
                  onClick={handleDownloadAll}
                  className={`text-white text-lg px-3 py-2  uppercase leading-none border-2 border-white  ${
                    downloadingAll ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  {downloadingAll ? "Preparing…" : "Download All"}
                </button>
              )}
            </div>
            <div className="grid grid-cols-4 max-md-tab:grid-cols-2 gap-2">
              {(() => {
                const gallerySorted =
                  data?.gallery && data?.previewGallery?.length > 0
                    ? [
                        ...data.previewGallery,
                        ...data.gallery.filter(
                          (img) => !data.previewGallery.includes(img)
                        ),
                      ]
                    : data?.gallery || [];

                return (
                  showAllGallery ? gallerySorted : gallerySorted.slice(0, 4)
                ).map((slide, index) => {
                  // const src =
                  //   slide?.replace(
                  //     "https://storage.bunnycdn.com/assets-erotichna",
                  //     "https://files-erotichna.b-cdn.net"
                  //   ) || "/assets/images/placeholder-dark.png";
                  const isPreview =
                    data?.previewGallery?.length > 0
                      ? data.previewGallery.includes(slide)
                      : index < 4;

                  const useBlurred = !user || (!haveSub && !isPreview);
                  const src = useBlurred
                    ? `/api/blurred?src=${encodeURIComponent(slide)}`
                    : slide?.replace(
                        "https://storage.bunnycdn.com/assets-erotichna",
                        "https://files-erotichna.b-cdn.net"
                      ) || "/assets/images/placeholder-dark.png";
                  const alt = `${
                    data?.title
                      ? data.title + " gallery image " + (index + 1)
                      : "Gallery image " + (index + 1)
                  }`;
                  const name = `${
                    data?.seo?.permalink || data?.title || "image"
                  }-${index + 1}.jpg`;
                  return (
                    <div key={index} className="relative group aspect-video">
                      <div
                        className={`absolute inset-0 bg-dark-150 animate-pulse rounded ${
                          thumbnailLoaded[index] ? "hidden" : ""
                        }`}
                      ></div>
                      <Image
                        src={
                          thumbError[index]
                            ? "/assets/images/placeholder-dark.png"
                            : src
                        }
                        alt={alt}
                        unoptimized={true}
                        width={1200}
                        height={800}
                        // className={`h-auto aspect-video ${
                        //   haveSub ? "" : "blur-sm"
                        // }`}
                        // className={`h-auto aspect-video`}
                        className={`h-auto aspect-video ${
                          thumbnailLoaded[index] ? "" : "opacity-0"
                        }`}
                        onLoadingComplete={() =>
                          setThumbnailLoaded((prev) => ({
                            ...prev,
                            [index]: true,
                          }))
                        }
                        onError={() => {
                          setThumbError((prev) => ({ ...prev, [index]: true }));
                          setThumbnailLoaded((prev) => ({
                            ...prev,
                            [index]: true,
                          }));
                        }}
                      />
                      {user && (haveSub || isPreview) && (
                        <div className="absolute bottom-2 right-2">
                          <button
                            onClick={() => handleDownloadImage(src, name)}
                            className="text-white text-xs px-2 py-1 bg-black bg-opacity-50 rounded flex items-center justify-center"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>
            {!showAllGallery && data?.gallery?.length > 4 && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => setShowAllGallery(true)}
                  className="text-white text-lg leading-none uppercase border-2 border-white px-3 py-2"
                >
                  Show All
                </button>
              </div>
            )}
          </div>
        )}

        {topVideosData?.topVideos?.videos.length > 0 && (
          <TopVideo
            title={topVideosData?.topVideos?.title}
            showAllVideoButton={true}
            videos={topVideosData?.topVideos?.videos || false}
          />
        )}
        {data && data?._id && (
          <Comments
            id={data?._id}
            post={{
              title: data?.title,
              link: "/videos/" + data?.seo?.permalink,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
