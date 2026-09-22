"use client";
import IconImageOutlined from "@/assets/icons/IconImageOutlined";
import ImageUploader from "@/components/dashboard/ImageUploader/ImageUploader";
import InputDashboard from "@/components/dashboard/InputDashboard/InputDashboard";
import Loader from "@/components/global/Loading/Loader";
import ToastError from "@/components/global/Toasts/ToastError";
import ToastSuccess from "@/components/global/Toasts/ToastSuccess";
import VideoPlayer from "@/components/global/videoPlayer/VideoPlayer";
import Switch from "@/components/ui/switch/Switch";
import Wrapper from "@/components/ui/wrapper/Wrapper";
import useAdmin from "@/contexts/admin/AdminDataProvider";
import MuxVideo from "@mux/mux-video-react";
import { Box, Flex } from "@radix-ui/themes";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const BannerSection = ({setBeOurModelData, getBeOurModelDataAPI, beOurModelData}) => {
  const [formData, setFormData] = useState({});
  const [success, setSuccess] = useState({});
  const [error, setError] = useState({});
  const [loader, setLoader] = useState(false);

  const updateSection = async (e) => {
    e.preventDefault();
    try {
      setLoader(true);
      const response = await fetch("/api/admin/be-our-model", {
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
          message: "Banner is Successfully updated.",
        });
        setBeOurModelData();
      }
    } catch (error) {
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (!beOurModelData) {
      getBeOurModelDataAPI();
    } else {
      setFormData({ banner: beOurModelData?.banner });
    }
  }, [beOurModelData]);

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
      <form
        onSubmit={(e) => updateSection(e)}
        className=" max-lg-mb:max-w-full w-full mb-4"
      >
        <button
          type="submit"
          className="text-center py-3 bg-black absolute top-0 right-4 text-white px-5 rounded-lg mt-3 text-sm font-satoshi"
        >
          Save Changes
        </button>
        <InputDashboard
          required
          name="heading"
          placeholder="Add Heading"
          label="Add Heading*"
          value={formData?.heading || ""}
          setInputData={(e) =>
            setFormData((prev) => ({
              ...prev,
              heading: e.target.value,
            }))
          }
        />
        <div className="mt-4"></div>
        <InputDashboard
          required
          name="video"
          placeholder="Add video id"
          label="Add Video *"
          value={formData?.video?.link || ""}
          setInputData={(e) =>
            setFormData((prev) => ({
              ...prev,
              video: {
                link: e.target.value,
              },
            }))
          }
        />
        {formData?.video?.link && (
          <Wrapper className="my-4">
            <Wrapper className="w-full">
              <VideoPlayer videoId={formData?.video?.link} autoplay="false" className='aspect-video' />
            </Wrapper>
          </Wrapper>
        )}
        <div className="mt-4"></div>
        <label className=" text-[#232323] text-sm font-medium font-satoshi leading-[19px] mb-3 block">
          Add Desktop Banner Poster  <span className="text-xs text-text-secondary font-satoshi">(1920X1080px with max size 1MB)</span>
        </label>
        <ImageUploader
        label={"(1920X1080px with max size 1MB)"}
          id={`uploader-desktop`}
          exportImage={(name, e, main) =>
            setFormData((prev) => ({
              ...prev,
              desktopImage: main,
              desktopImageData: { name, src: e },
            }))
          }
          prevImage={formData?.desktopImage?.replace(
            "https://storage.bunnycdn.com/assets-erotichna",
            "https://files-erotichna.b-cdn.net"
          )}
        />
        <div className="mt-4"></div>
        <label className=" text-[#232323] text-sm font-medium font-satoshi leading-[19px] mb-3 block">
          Add Mobile Banner Poster  <span className="text-xs text-text-secondary font-satoshi">(750X900px with max size 1MB)</span>
        </label>
        <ImageUploader
        label={"(750X900px with max size 1MB)"}
          id={`uploader-mobile`}
          exportImage={(name, e, main) =>
            setFormData((prev) => ({
              ...prev,
              mobileImage: main,
              mobileImageData: { name, src: e },
            }))
          }
          prevImage={formData?.mobileImage?.replace(
            "https://storage.bunnycdn.com/assets-erotichna",
            "https://files-erotichna.b-cdn.net"
          )}
        />
        <div className="flex justify-end">
        <button
          type="submit"
          className="text-center py-3 bg-black  text-white px-5 rounded-lg mt-3 text-sm font-satoshi"
        >
          Save Changes
        </button>
        </div>
      </form>
    </div>
  );
};

export default BannerSection;
