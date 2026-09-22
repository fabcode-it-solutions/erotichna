"use client";
import IconImageOutlined from "@/assets/icons/IconImageOutlined";
import ImageUploader from "@/components/dashboard/ImageUploader/ImageUploader";
import InputDashboard from "@/components/dashboard/InputDashboard/InputDashboard";
import Loader from "@/components/global/Loading/Loader";
import ToastError from "@/components/global/Toasts/ToastError";
import ToastSuccess from "@/components/global/Toasts/ToastSuccess";
import VideoPlayer from "@/components/global/videoPlayer/VideoPlayer";
import Wrapper from "@/components/ui/wrapper/Wrapper";
import useTheme from "@/contexts/theme/ThemeProvider";
import MuxVideo from "@mux/mux-video-react";
import { Box, Flex } from "@radix-ui/themes";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const Upcoming = () => {
  const { upcomingData, setUpcomingData, fetchData } = useTheme();
  const [formData, setFormData] = useState({});
  const [success, setSuccess] = useState({});
  const [error, setError] = useState({});
  const [loader, setLoader] = useState(false);
  const updateSection = async () => {
    try {
      setLoader(true);
      const response = await fetch("/api/admin/homepage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
        }),
      });
      const data = await response.json();
      if (!data.error) {
        setSuccess({
          active: true,
          message: "Section is Successfully updated.",
        });
        fetchData("upcoming", setUpcomingData);
      } else {
        setError({
          active: true,
          message: data.error,
        });
      }
    } catch (error) {
      setError({
        active: true,
        message: "Something went wrong! Try again later.",
      });
    } finally {
      setLoader(false);
    }
  };
  useEffect(() => {
    if (upcomingData?.upcoming) {
      
      setFormData({ upcoming: upcomingData?.upcoming });
    }
  }, [upcomingData]);

  return (
    <div>
      {loader && <Loader message="Updating section..." />}
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
      <Box className=" max-lg-mb:max-w-full w-full mb-4">
        <button
          onClick={() => updateSection()}
          type="button"
          className="text-center py-3 bg-black absolute top-0 right-4 text-white px-5 rounded-lg mt-3 text-sm font-satoshi"
        >
          Save Changes
        </button>
        <InputDashboard
          required
          name="heading"
          placeholder="Add heading"
          label="Add Heading *"
          value={formData?.upcoming?.title || ""}
          setInputData={(e) =>
            setFormData((prev) => ({
              ...prev,
              upcoming: {
                ...prev.upcoming,
                title: e.target.value,
              },
            }))
          }
        />
        <label className=" text-[#232323] text-sm font-medium font-satoshi leading-[19px] my-3 block">
          Add Cover Image *{" "}
          <span className="text-xs text-text-secondary font-satoshi">
            (1920X1080px with max size 1MB)
          </span>
        </label>
        <div className="w-full">
          <ImageUploader
            label={"(1920X1080px with max size 1MB)"}
            id={`video-uploader-`}
            exportImage={(name, e, main) =>
              setFormData((prev) => ({
                ...prev,
                upcoming: {
                  ...prev.upcoming,
                  cover: main,
                  imageData: { name, src: e },
                },
              }))
            }
            prevImage={formData?.upcoming?.cover?.replace(
              "https://storage.bunnycdn.com/assets-erotichna",
              "https://files-erotichna.b-cdn.net"
            )}
          />
        </div>
        <Box className="mt-3">
          {" "}
          <InputDashboard
            required
            name="video"
            placeholder="Add video id"
            label="Add Video *"
            value={formData?.upcoming?.video?.link || ""}
            setInputData={(e) =>
              setFormData((prev) => ({
                ...prev,
                upcoming: {
                  ...prev.upcoming,
                  video: {
                    ...prev.upcoming.video,
                    link: e.target.value,
                  },
                },
              }))
            }
          />
        </Box>
        {formData?.upcoming?.video?.link && (
          <Wrapper className="my-4">
            <Wrapper className="w-full">
              <VideoPlayer
                autoplay={"false"}
                videoId={formData?.upcoming?.video?.link}
                className="aspect-video"
              />
            </Wrapper>
          </Wrapper>
        )}
        <Box className="mt-3">
          <InputDashboard
            required
            name="video"
            placeholder="Add video id for mobile"
            label="Add Mobile Video"
            info="(Please add video with 1080X1280px)"
            value={formData?.upcoming?.video?.mobileLink || ""}
            setInputData={(e) =>
              setFormData((prev) => ({
                ...prev,
                upcoming: {
                  ...prev.upcoming,
                  video: {
                    ...prev.upcoming.video,
                    mobileLink: e.target.value,
                  },
                },
              }))
            }
          />
        </Box>
        {formData?.upcoming?.video?.mobileLink && (
          <Wrapper className="my-4">
            <Wrapper className="w-full">
              <VideoPlayer
                autoplay={"false"}
                videoId={formData?.upcoming?.video?.mobileLink}
                className="aspect-video"
              />
            </Wrapper>
          </Wrapper>
        )}
        <Box className="mt-3">
          <InputDashboard
            required
            name="bannerLink"
            placeholder="Add link to play button"
            label="Add Link *"
            value={formData?.upcoming?.link || ""}
            setInputData={(e) =>
              setFormData((prev) => ({
                ...prev,
                upcoming: {
                  ...prev.upcoming,
                  link: e.target.value,
                },
              }))
            }
          />
        </Box>
      </Box>
    </div>
  );
};

export default Upcoming;
