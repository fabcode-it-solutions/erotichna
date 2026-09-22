"use client";
import IconImageOutlined from "@/assets/icons/IconImageOutlined";
import GetVideoData from "@/components/dashboard/GetVideoData/GetVideoData";
import ImageUploader from "@/components/dashboard/ImageUploader/ImageUploader";
import InputDashboard from "@/components/dashboard/InputDashboard/InputDashboard";
import Loader from "@/components/global/Loading/Loader";
import ToastSuccess from "@/components/global/Toasts/ToastSuccess";
import VideoPlayer from "@/components/global/videoPlayer/VideoPlayer";
import Switch from "@/components/ui/switch/Switch";
import Wrapper from "@/components/ui/wrapper/Wrapper";
import useTheme from "@/contexts/theme/ThemeProvider";
import { Box, Flex } from "@radix-ui/themes";

import React, { useEffect, useState } from "react";

const BannerSection = () => {
  const { setBannerData, bannerData, fetchData } = useTheme();
  const [formData, setFormData] = useState({});
  const [success, setSuccess] = useState({});
  const [loading, setLoading] = useState(false);

  const updateSection = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/homepage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
        }),
      });
      const data = await response.json();
      if (!data.error) {
        setLoading(false);
        setSuccess({
          active: true,
          message: "Banner is Successfully updated.",
        });
        fetchData("banner", setBannerData);
      }
    } catch (error) {
      setLoading(false);
    } finally {
    }
  };
  useEffect(() => {
    if (bannerData) {
      setFormData({ banner: bannerData.banner });
    }
  }, [bannerData]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFormData((prev) => ({
      ...prev,
      banner: {
        ...prev.banner,
        trailer: {},
      },
    }));

    if (file && file.type === "video/mp4") {
      const videoURL = URL.createObjectURL(file);
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result.split("base64,")[1];
        setFormData((prev) => ({
          ...prev,
          banner: {
            ...prev.banner,
            trailer: {
              src: videoURL,
              name: file.name,
              base64Data: base64Data,
              result: reader.result,
            },
          },
        }));
      };
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please select an MP4 video file.");
    }
  };
  const getVideoDetails = (e) => {
    console.log(e);
    setFormData((prev) => ({
      banner: {
        ...prev.banner,
        desktop: e.poster,
        video: { link: e.hoveredVideo.src, mobileLink: e.hoveredVideo.src },
        link: `/videos/${e.seo.permalink}`,
        heading: e.title,
        mainHeading: e.models[0].name,
        mainHeadingLink: e.models[0].link,
        secondaryButton: {
          ...(prev.banner?.secondaryButton || {}),
          link: `/videos/${e.seo.permalink}`,
        },
      },
    }));
  };
  return (
    <div>
      {success?.active && (
        <ToastSuccess
          active={success?.active}
          message={success?.message}
          setSuccess={setSuccess}
        />
      )}
      {loading && <Loader message="Updating Banner..." />}
      <Box className=" max-lg-mb:max-w-full w-full mb-4">
        <button
          onClick={() => updateSection()}
          type="button"
          className="text-center py-3 bg-black absolute top-0 right-4 text-white px-5 rounded-lg mt-3 text-sm font-satoshi"
        >
          Save Changes
        </button>
        <label className=" text-[#232323] text-sm font-medium font-satoshi leading-[19px] mb-3 block">
          Add via a Video
        </label>
        <GetVideoData setVideoDetails={(e) => getVideoDetails(e)} />
        <div className="my-8 relative">
          <div className="bg-black bg-opacity-15 w-full h-[1px]"></div>
          <div className="bg-white px-2 text-sm text-black absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 ">
            Or
          </div>
        </div>

        <label className=" text-[#232323] text-sm font-medium font-satoshi leading-[19px] mb-3 block">
          Add Banner Poster{" "}
          <span className="text-xs text-text-secondary font-satoshi">
            (1920X1080px with max size 1MB)
          </span>
        </label>
        <ImageUploader
          label={"1920X1080px with max size 1MB"}
          id="banner-poster"
          exportImage={(name, e) =>
            setFormData((prev) => ({
              ...prev,
              banner: { ...prev.banner, desktopUpload: { name, src: e } },
            }))
          }
          prevImage={formData?.banner?.desktop?.replace(
            "https://storage.bunnycdn.com/assets-erotichna",
            "https://files-erotichna.b-cdn.net"
          )}
        />

        <label className=" text-[#232323] text-sm font-medium font-satoshi leading-[19px] my-3 block">
          Add Banner Poster (Mobile){" "}
          <span className="text-xs text-text-secondary font-satoshi">
            (1080X1280px with max size 1MB)
          </span>
        </label>
        <ImageUploader
          id="banner-poster-mobile"
          exportImage={(name, e) =>
            setFormData((prev) => ({
              ...prev,
              banner: { ...prev.banner, mobileUpload: { name, src: e } },
            }))
          }
          prevImage={formData?.banner?.mobile?.replace(
            "https://storage.bunnycdn.com/assets-erotichna",
            "https://files-erotichna.b-cdn.net"
          )}
        />
      </Box>

      <InputDashboard
        name="video"
        placeholder="Add video id or link"
        label="Add Hover Video"
        value={formData?.banner?.video?.link || ""}
        setInputData={(e) =>
          setFormData((prev) => ({
            ...prev,
            banner: {
              ...prev.banner,
              video: {
                ...prev.banner.video,
                link: e.target.value,
              },
            },
          }))
        }
      />

      {formData?.banner?.video?.link && (
        <Wrapper className="my-4">
          <VideoPlayer
            className="aspect-video"
            autoplay={"false"}
            videoId={formData?.banner?.video?.link}
          />
        </Wrapper>
      )}
      <Box className="mt-3">
        <InputDashboard
          required
          name="video"
          placeholder="Add video id for mobile"
          label="Add Mobile Video"
          info="(Please add video with 1080X1280px)"
          value={formData?.banner?.video?.mobileLink || ""}
          setInputData={(e) =>
            setFormData((prev) => ({
              ...prev,
              banner: {
                ...prev.banner,
                video: {
                  ...prev.banner.video,
                  mobileLink: e.target.value,
                },
              },
            }))
          }
        />
      </Box>
      {formData?.banner?.video?.mobileLink && (
        <Wrapper className="my-4">
          <VideoPlayer
            className="aspect-video"
            autoplay={"false"}
            videoId={formData?.banner?.video?.mobileLink}
          />
        </Wrapper>
      )}
      <label className=" text-[#232323] hidden text-sm font-medium font-satoshi leading-[19px] my-3 ">
        Add Trailer Video
      </label>
      <label
        htmlFor={"t-v-u"}
        className="min-h-[238px] relative  max-lg-mb:min-h-[159px] max-lg-mb:border-0 cursor-pointer bg-[#F7F8F9] max-md-tab:bg-white rounded-xl hidden items-center justify-center border border-dashed border-black border-opacity-20"
      >
        <Flex direction={"column"} justify={"center"} align={"center"}>
          <IconImageOutlined className="fill-heading w-5 h-5" />
          <p className="text-[#92929D] max-lg-mb:hidden text-center mt-1 mb-[5px] font-satoshi text-sm leading-6 font-normal">
            <u className="font-medium text-[#1B2432]">Click to upload</u> or
            drag and drop
          </p>
          <u className="font-medium text-[#1B2432] text-xsm leading-6 font-satoshi hidden max-lg-mb:block">
            Upload Video
          </u>
          <span className="text-center font-satoshi block text-[10px] font-normal leading-[18.1px] text-[#92929D]">
            MP4
          </span>
        </Flex>
        {formData?.banner?.trailer?.src && (
          <button
            className="absolute right-2 bottom-2 z-[2] pointer-events-none
            text-center py-3 bg-black text-white px-5 rounded-lg mt-3 text-sm font-satoshi
            "
          >
            Change Video
          </button>
        )}
        {formData?.banner?.trailer?.src && (
          <div
            className="rounded-xl overflow-hidden pointer-events-none  absolute max-md-tab:bg-white top-0 left-0 
             w-full h-full
              mb-3 flex justify-center items-center bg-[#F7F8F9]"
          >
            <video
              width="640"
              className="aspect-video w-auto"
              controls
              autoPlay
              loop
              muted
              playsInline
            >
              <source src={formData?.banner?.trailer?.src} type="video/mp4" />
            </video>
          </div>
        )}
      </label>
      <input
        type="file"
        accept="video/mp4"
        className="hidden"
        onChange={handleFileChange}
        id="t-v-u"
      />
      <Box className="mt-3">
        <InputDashboard
          name="bannerLink"
          placeholder="Add link to play button"
          label="Add Link  to play button "
          value={formData?.banner?.link || ""}
          setInputData={(e) =>
            setFormData((prev) => ({
              ...prev,
              banner: {
                ...prev.banner,
                link: e.target.value,
              },
            }))
          }
        />
      </Box>

      <label className=" text-[#232323] text-base font-medium pt-6 border-t border-stroke font-satoshi leading-[19px] my-6 flex justify-between items-center">
        Add Banner Content
      </label>
      <div className="flex gap-3 max-md-tab:flex-wrap">
        <InputDashboard
          name="subheading"
          placeholder="Add Sub Heading"
          label="Add Sub Heading"
          value={formData?.banner?.subHeading || ""}
          setInputData={(e) =>
            setFormData((prev) => ({
              ...prev,
              banner: {
                ...prev.banner,
                subHeading: e.target.value,
              },
            }))
          }
        />

        <InputDashboard
          name="heading"
          placeholder="Add Heading"
          label="Add Heading"
          value={formData?.banner?.heading || ""}
          setInputData={(e) =>
            setFormData((prev) => ({
              ...prev,
              banner: {
                ...prev.banner,
                heading: e.target.value,
              },
            }))
          }
        />
      </div>
      <div className="flex gap-3 max-md-tab:flex-wrap mt-3">
        <InputDashboard
          name="mainheading"
          placeholder="Add Main Heading"
          label="Add Main Heading"
          value={formData?.banner?.mainHeading || ""}
          setInputData={(e) =>
            setFormData((prev) => ({
              ...prev,
              banner: {
                ...prev.banner,
                mainHeading: e.target.value,
              },
            }))
          }
        />

        <InputDashboard
          name="mainheadinglink"
          placeholder="Add a link"
          label="Add Link to  Main Heading"
          value={formData?.banner?.mainHeadingLink || ""}
          setInputData={(e) =>
            setFormData((prev) => ({
              ...prev,
              banner: {
                ...prev.banner,
                mainHeadingLink: e.target.value,
              },
            }))
          }
        />
      </div>

      <label className=" text-[#232323] text-base font-medium pt-6 border-t border-stroke font-satoshi leading-[19px] my-6 flex justify-between items-center">
        Primary Button
      </label>
      <div className="flex gap-2 max-md-tab:flex-wrap">
        <InputDashboard
          name="label"
          placeholder="Add a label"
          label="Add label"
          value={formData?.banner?.primaryButton?.label || ""}
          setInputData={(e) =>
            setFormData((prev) => ({
              ...prev,
              banner: {
                ...prev.banner,
                primaryButton: {
                  label: e.target.value,
                  link: formData?.banner?.primaryButton?.link,
                },
              },
            }))
          }
        />
        <InputDashboard
          name="link"
          placeholder="Add a Link"
          label="Add Link"
          value={formData?.banner?.primaryButton?.link || ""}
          setInputData={(e) =>
            setFormData((prev) => ({
              ...prev,
              banner: {
                ...prev.banner,
                primaryButton: {
                  link: e.target.value,
                  label: formData?.banner?.primaryButton?.label,
                },
              },
            }))
          }
        />
      </div>
      <label className=" text-[#232323] text-base font-medium pt-6 border-t border-stroke font-satoshi leading-[19px] my-6 flex justify-between items-center">
        Secondary Button{" "}
        <label
          className=" text-[#232323] text-sm font-medium font-satoshi leading-[19px] flex items-center whitespace-nowrap gap-3    
        "
        >
          Show Play Icon
          <Switch
            defaultState={formData?.banner?.secondaryButton?.icon}
            getState={(e) =>
              setFormData((prev) => ({
                ...prev,
                banner: {
                  ...prev.banner,
                  secondaryButton: {
                    ...(prev.banner?.secondaryButton || {}),
                    icon: e,
                  },
                },
              }))
            }
          />
        </label>
      </label>
      <div className="flex gap-2 max-md-tab:flex-wrap">
        <InputDashboard
          name="secondaryButtonlabel"
          placeholder="Add a label"
          label="Add label"
          value={formData?.banner?.secondaryButton?.label || ""}
          setInputData={(e) =>
            setFormData((prev) => ({
              ...prev,
              banner: {
                ...prev.banner,
                secondaryButton: {
                  ...(prev.banner?.secondaryButton || {}),
                  label: e.target.value,
                },
              },
            }))
          }
        />
        <InputDashboard
          name="secondaryButtonlink"
          placeholder="Add a Link"
          label="Add Link"
          value={formData?.banner?.secondaryButton?.link || ""}
          setInputData={(e) =>
            setFormData((prev) => ({
              ...prev,
              banner: {
                ...prev.banner,
                secondaryButton: {
                  ...(prev.banner?.secondaryButton || {}),
                  link: e.target.value,
                },
              },
            }))
          }
        />
      </div>
      <div className="flex justify-end">
        <button
          onClick={() => updateSection()}
          type="button"
          className="text-center py-3 bg-black  text-white px-5 rounded-lg mt-3 text-sm font-satoshi"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default BannerSection;
