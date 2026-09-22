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
import useAuth from "@/contexts/auth/AuthProvider";
import useTheme from "@/contexts/theme/ThemeProvider";
import { Box, Flex } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";

const Richtext = ({ bannerData }) => {
  const { fetchData } = useTheme();
  const { user } = useAuth();
  const [formData, setFormData] = useState({});
  const [success, setSuccess] = useState({});
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const updateSection = async () => {
    if (!formData?.heading) {
      setError((prev) => ({
        ...prev,
        active: true,
        message: "Heading is required",
      }));
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/admin/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-token": user.userID },
        body: JSON.stringify({
          type: "richtext",
          label: formData?.heading,
          ...formData,
        }),
      });
      const data = await response.json();
      if (!data.error) {
        const response = await fetch("/api/admin/homepage/editor", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-token": user.userID,
          },
          body: JSON.stringify({
            ...data,
          }),
        });
        const homepageData = await response.json();
        if (!homepageData.error) {
          setLoading(false);
          setSuccess({
            active: true,
            message: "Richtext is Successfully updated.",
          });
        } else {
          setError({
            active: true,
            message: homepageData?.error,
          });
        }
      } else {
        setError({
          active: true,
          message: data?.error,
        });
      }
    } catch (error) {
      setError({
        active: true,
        message: data?.error,
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (bannerData) {
      setFormData({ banner: bannerData });
    }
  }, [bannerData]);

  return (
    <div>
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
      {loading && <Loader message="Updating Richtext..." />}
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
          placeholder="Add Heading"
          label="Add Heading *"
          value={formData?.heading || ""}
          setInputData={(e) =>
            setFormData((prev) => ({
              ...prev,
              heading: e.target.value,
            }))
          }
        />

        <InputDashboard
          name="description"
          placeholder="Add description"
          label="Add description"
          labelBgColor="mt-3"
          value={formData?.description || ""}
          setInputData={(e) =>
            setFormData((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }
        />
        <label className=" text-[#232323] text-base font-medium pt-6 border-t border-stroke font-satoshi leading-[19px] my-6 flex justify-between items-center">
          Primary Button
        </label>
        <div className="flex gap-2 max-md-tab:flex-wrap">
          <InputDashboard
            name="label"
            placeholder="Add a label"
            label="Add label"
            value={formData?.primaryButton?.label || ""}
            setInputData={(e) =>
              setFormData((prev) => ({
                ...prev,
                primaryButton: {
                  label: e.target.value,
                  link: formData?.primaryButton?.link,
                },
              }))
            }
          />
          <InputDashboard
            name="link"
            placeholder="Add a Link"
            label="Add Link"
            value={formData?.primaryButton?.link || ""}
            setInputData={(e) =>
              setFormData((prev) => ({
                ...prev,
                primaryButton: {
                  link: e.target.value,
                  label: formData?.primaryButton?.label,
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
              defaultState={formData?.secondaryButton?.icon}
              getState={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  secondaryButton: {
                    ...(prev.secondaryButton || {}),
                    icon: e,
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
            value={formData?.secondaryButton?.label || ""}
            setInputData={(e) =>
              setFormData((prev) => ({
                ...prev,
                secondaryButton: {
                  ...(prev.secondaryButton || {}),
                  label: e.target.value,
                },
              }))
            }
          />
          <InputDashboard
            name="secondaryButtonlink"
            placeholder="Add a Link"
            label="Add Link"
            value={formData?.secondaryButton?.link || ""}
            setInputData={(e) =>
              setFormData((prev) => ({
                ...prev,
                secondaryButton: {
                  ...(prev.secondaryButton || {}),
                  link: e.target.value,
                },
              }))
            }
          />
        </div>
      </Box>
    </div>
  );
};

export default Richtext;
