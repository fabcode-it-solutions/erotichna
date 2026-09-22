"use client";
import IconImageOutlined from "@/assets/icons/IconImageOutlined";
import ImageUploader from "@/components/dashboard/ImageUploader/ImageUploader";
import InputDashboard from "@/components/dashboard/InputDashboard/InputDashboard";
import Loader from "@/components/global/Loading/Loader";
import ToastSuccess from "@/components/global/Toasts/ToastSuccess";
import useTheme from "@/contexts/theme/ThemeProvider";
import { Box, Flex } from "@radix-ui/themes";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const SingleImageSecond = () => {
  const { singleImageSecond, setSingleImageSecond, fetchData } = useTheme();
  const [formData, setFormData] = useState({});
  const [success, setSuccess] = useState({});
  const [loader, setLoader] = useState(false);
  const updateSection = async () => {
    setLoader(true);
    try {
      const response = await fetch("/api/admin/homepage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
        }),
      });
      const data = await response.json();
      if (data) {
        setLoader(false);
        setSuccess({
          active: true,
          message: "Single image is Successfully updated.",
        });
        fetchData("singleImageSecond", setSingleImageSecond);
      }
    } catch (error) {
      setLoader(false);
    } finally {
      setLoader(false);
    }
  };
  useEffect(() => {
    if (singleImageSecond) {
      setFormData({ singleImageSecond: singleImageSecond?.singleImageSecond });
    }
  }, [singleImageSecond]);
  return (
    <Box className=" max-lg-mb:max-w-full w-full mb-4">
      {loader && <Loader message="Updating Section..." />}
      {success?.active && (
        <ToastSuccess
          active={success?.active}
          message={success?.message}
          setSuccess={setSuccess}
        />
      )}
      <button
        onClick={() => updateSection()}
        type="button"
        className="text-center py-3 bg-black absolute top-0 right-4 text-white px-5 rounded-lg mt-3 text-sm font-satoshi"
      >
        Save Changes
      </button>
      <label className=" text-[#232323] text-sm font-medium font-satoshi leading-[19px] mb-3 block">
        Add Banner Poster  <span className="text-xs text-text-secondary font-satoshi">(1920X1080px with max size 1MB)</span>
      </label>
      <ImageUploader
      label={"(1920X1080px with max size 1MB)"}
        prevImage={formData?.singleImageSecond?.desktop?.replace(
          "https://storage.bunnycdn.com/assets-erotichna",
          "https://files-erotichna.b-cdn.net"
        )}
        exportImage={(name, e, main) =>
          setFormData((prev) => ({
            ...prev,
            singleImageSecond: {
              ...prev.singleImageSecond,
              desktop: main,
              desktopImageData: {
                name: name,
                src: e,
              },
            },
          }))
        }
        id="desktop-image"
      />

      <label className=" text-[#232323] text-sm font-medium font-satoshi leading-[19px] my-3 block">
        Add Banner Poster (Mobile)  <span className="text-xs text-text-secondary font-satoshi">(750X900px with max size 1MB)</span>
      </label>

      <ImageUploader
      label={"(750X900px with max size 1MB)"}
        prevImage={formData?.singleImageSecond?.mobile?.replace(
          "https://storage.bunnycdn.com/assets-erotichna",
          "https://files-erotichna.b-cdn.net"
        )}
        exportImage={(name, e, main) =>
          setFormData((prev) => ({
            ...prev,
            singleImageSecond: {
              ...prev.singleImageSecond,
              mobile: main,
              mobileImageData: {
                name: name,
                src: e,
              },
            },
          }))
        }
        id="mobile-image"
      />
      <Box className="mt-3">
        <InputDashboard
          name="bannerLink"
          placeholder="Add link"
          label="Add Link"
          value={formData?.singleImageSecond?.link || ""}
          setInputData={(e) =>
            setFormData((prev) => ({
              ...prev,
              singleImageSecond: {
                ...prev.singleImageSecond,
                link: e.target.value,
              },
            }))
          }
        />
      </Box>
    </Box>
  );
};

export default SingleImageSecond;
