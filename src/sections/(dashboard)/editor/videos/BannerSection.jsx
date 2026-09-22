"use client";
import IconImageOutlined from "@/assets/icons/IconImageOutlined";
import InputDashboard from "@/components/dashboard/InputDashboard/InputDashboard";
import ToastSuccess from "@/components/global/Toasts/ToastSuccess";
import Switch from "@/components/ui/switch/Switch";
import Wrapper from "@/components/ui/wrapper/Wrapper";
import useTheme from "@/contexts/theme/ThemeProvider";
import MuxVideo from "@mux/mux-video-react";
import { Box, Flex } from "@radix-ui/themes";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const BannerSection = () => {
  const { homeData, setHomeData } = useTheme();
  const [formData, setFormData] = useState({});
  const [success, setSuccess] = useState({});
  const getImages = (e, field) => {
    const file = e.target.files[0];
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({
          ...prev,
          banner: {
            ...prev.banner,
            [field]: reader.result,
          },
        }));
      };
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
      };
      reader.readAsDataURL(file);
    }
  };
  const updateSection = async () => {
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
        setSuccess({
          active: true,
          message: "Banner is Successfully updated.",
        });
        setHomeData();
      }
    } catch (error) {
    } finally {
    }
  };
  useEffect(() => {
    if (homeData) {
      setFormData({ banner: homeData?.banner });
    }
  }, [homeData]);
  return (
    <div>
      {success?.active && (
        <ToastSuccess
          active={success?.active}
          message={success?.message}
          setSuccess={setSuccess}
        />
      )}{" "}
      <button
        onClick={() => updateSection()}
        type="button"
        className="text-center py-3 bg-black absolute top-0 right-4 text-white px-5 rounded-lg mt-3 text-sm font-satoshi"
      >
        Save Changes
      </button>
      <InputDashboard
        name="video"
        placeholder="Add Heading"
        label="Add Heading"
        value={formData?.banner?.video?.link || ""}
        setInputData={(e) =>
          setFormData((prev) => ({
            ...prev,
            banner: {
              ...prev.banner,
              video: {
                link: e.target.value,
              },
            },
          }))
        }
      />
     
    </div>
  );
};

export default BannerSection;
