"use client";
import AddVideos from "@/components/dashboard/AddVideos/AddVideos";
import GetVideoData from "@/components/dashboard/GetVideoData/GetVideoData";
import InputDashboard from "@/components/dashboard/InputDashboard/InputDashboard";
import Loader from "@/components/global/Loading/Loader";
import ToastError from "@/components/global/Toasts/ToastError";
import ToastSuccess from "@/components/global/Toasts/ToastSuccess";
import useTheme from "@/contexts/theme/ThemeProvider";
import { Box } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";

const TopVideos = () => {
  const [prevData, setPrevData] = useState({});
  const [formData, setFormData] = useState({});
  const { topVideosData, setTopVideosData, fetchData } = useTheme();
  const [success, setSuccess] = useState({});
  const [error, setError] = useState({});
  const [loader, setLoader] = useState(false);

  const updateSection = async () => {
    
    
    if (!formData.topVideos) {
      setError({
        active: true,
        message: "Nothing to update.",
      });
      return;
    }
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
        setLoader(false);
        setSuccess({
          active: true,
          message: "Videos are Successfully updated.",
        });
        fetchData("topVideos", setTopVideosData);
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
    if (topVideosData?.topVideos) {
      setPrevData({ topVideos: topVideosData?.topVideos });
    }
  }, [topVideosData]);
  return (
    <div>
      {loader && <Loader message="Top videos updated." />}
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
          name="heading"
          placeholder="Add heading"
          label="Add Heading"
          value={formData?.topVideos?.title || prevData?.topVideos?.title || ""}
          setInputData={(e) =>
            setFormData((prev) => ({
              ...prev,
              topVideos: {
                ...prev.topVideos,
                title: e.target.value,
              },
            }))
          }
        />
        <AddVideos
          field="topVideos"
          setFormData={setFormData}
          
          data={prevData?.topVideos?.videos.sort((a, b) => a.order - b.order) || []}
        />
      </Box>
    </div>
  );
};

export default TopVideos;
