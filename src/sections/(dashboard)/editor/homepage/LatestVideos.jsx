"use client";
import AddVideos from "@/components/dashboard/AddVideos/AddVideos";
import GetVideoData from "@/components/dashboard/GetVideoData/GetVideoData";
import InputDashboard from "@/components/dashboard/InputDashboard/InputDashboard";
import Loader from "@/components/global/Loading/Loader";
import ToastError from "@/components/global/Toasts/ToastError";
import ToastSuccess from "@/components/global/Toasts/ToastSuccess";
import Switch from "@/components/ui/switch/Switch";
import useTheme from "@/contexts/theme/ThemeProvider";
import MuxVideo from "@mux/mux-video-react";
import { Box } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";

const LatestVideos = () => {
  const [formData, setFormData] = useState({});
  const { latestVideosData, setLatestVideosData, fetchData } = useTheme();
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
          message: "Videos are Successfully updated.",
        });
        fetchData("latestVideos", setLatestVideosData);
      } else {
        setError({
          active: true,
          message: data.error,
        });
        setLoader(false);
      }
    } catch (error) {
      setError({
        active: true,
        message: error.error,
      });
      setLoader(false);
    } finally {
      setLoader(false);
    }
  };
  useEffect(() => {
    if (latestVideosData?.latestVideos) {
      setFormData({ latestVideos: latestVideosData?.latestVideos });
    }
  }, [latestVideosData]);
  useEffect(() => {}, [formData]);
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
          name="heading"
          placeholder="Add heading"
          label="Add Heading"
          value={formData?.latestVideos?.title || ""}
          setInputData={(e) =>
            setFormData((prev) => ({
              ...prev,
              latestVideos: {
                ...prev.latestVideos,
                title: e.target.value,
              },
            }))
          }
        />
        <div className="my-4 text-center font-semibold">
          Videos Will fetched Automatically
        </div>
        <div className="hidden">
        <AddVideos
          field="latestVideos"
          setFormData={setFormData}
          data={formData?.latestVideos?.videos || []}
        />
        </div>
        <label className=" text-[#232323] text-base font-medium pt-6 border-t border-stroke font-satoshi leading-[19px] my-6 flex justify-between items-center">
          Show All Button
        </label>
        <div className="flex gap-2 max-md-tab:flex-wrap">
          <InputDashboard
            name="label"
            placeholder="Add a label"
            label="Add label"
            value={formData?.latestVideos?.primaryButton?.label || ""}
            setInputData={(e) =>
              setFormData((prev) => ({
                ...prev,
                latestVideos: {
                  ...prev.latestVideos,
                  primaryButton: {
                    label: e.target.value,
                    link: formData?.latestVideos?.primaryButton?.link,
                  },
                },
              }))
            }
          />
          <InputDashboard
            name="link"
            placeholder="Add a Link"
            label="Add Link"
            value={formData?.latestVideos?.primaryButton?.link || ""}
            setInputData={(e) =>
              setFormData((prev) => ({
                ...prev,
                latestVideos: {
                  ...prev.latestVideos,
                  primaryButton: {
                    link: e.target.value,
                    label: formData?.latestVideos?.primaryButton?.label,
                  },
                },
              }))
            }
          />
        </div>
        <label
          className=" text-[#232323] text-sm font-medium font-satoshi leading-[19px] mt-6 flex justify-between items-center
        border-y border-stroke py-3
        "
        >
          Show All Button
          <Switch
            defaultState={formData?.latestVideos?.showAllButton}
            getState={(e) =>
              setFormData((prev) => ({
                ...prev,
                latestVideos: {
                  ...prev.latestVideos,
                  showAllButton: e,
                },
              }))
            }
          />
        </label>
      </Box>
    </div>
  );
};

export default LatestVideos;
