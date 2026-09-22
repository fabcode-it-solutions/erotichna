"use client";
import IconImageOutlined from "@/assets/icons/IconImageOutlined";
import ImageUploader from "@/components/dashboard/ImageUploader/ImageUploader";
import InputDashboard from "@/components/dashboard/InputDashboard/InputDashboard";
import ToastSuccess from "@/components/global/Toasts/ToastSuccess";
import Switch from "@/components/ui/switch/Switch";
import Wrapper from "@/components/ui/wrapper/Wrapper";
import useAdmin from "@/contexts/admin/AdminDataProvider";
import useTheme from "@/contexts/theme/ThemeProvider";
import MuxVideo from "@mux/mux-video-react";
import { Box, Flex } from "@radix-ui/themes";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const BannerSection = () => {
  const { getEditorModelsDataAPI,
    editorModelsData , setEditorModelsData } = useAdmin();

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
      const response = await fetch("/api/admin/editor-models", {
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
        setEditorModelsData();
      }
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    if (!editorModelsData) {
      getEditorModelsDataAPI();
    }else{
      setFormData({ banner: editorModelsData?.banner });
    }
  }, [editorModelsData ,getEditorModelsDataAPI])

  return (
    <div>
      {success?.active && (
        <ToastSuccess
          active={success?.active}
          message={success?.message}
          setSuccess={setSuccess}
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
        <label className=" text-[#232323] text-sm font-medium font-satoshi leading-[19px] mb-3 block">
          Add Banner Poster
        </label>
        <label
          htmlFor="images"
          className="min-h-[238px] relative max-lg-mb:min-h-[159px] max-lg-mb:border-0
           cursor-pointer bg-[#F7F8F9] rounded-xl flex items-center justify-center border border-dashed border-black border-opacity-20"
        >


          <Flex direction={"column"} justify={"center"} align={"center"}>
            <IconImageOutlined className="fill-heading w-5 h-5" />

            <p className="text-[#92929D] max-lg-mb:hidden text-center mt-1 mb-[5px] font-satoshi text-sm leading-6 font-normal">
              <u className="font-medium text-[#1B2432]">Click to upload</u> or
              drag and drop
            </p>
            <u className="font-medium text-[#1B2432] text-xsm leading-6 font-satoshi hidden max-lg-mb:block">
              Upload images
            </u>
            <span className="text-center font-satoshi block text-[10px] font-normal leading-[18.1px] text-[#92929D]">
              PNG, JPG, JPEG
            </span>
          </Flex>
          {formData?.banner?.desktop && (
            <button className="absolute right-2 bottom-2 z-[2] pointer-events-none
            text-center py-3 bg-black text-white px-5 rounded-lg mt-3 text-sm font-satoshi
            ">Change Image</button>

          )}
          {formData?.banner?.desktop && (
            <div className="rounded-xl overflow-hidden pointer-events-none  absolute max-md-tab:bg-white top-0 left-0 
             w-full h-full
              mb-3 flex justify-center items-center bg-[#F7F8F9]">
              <Image
                src={formData?.banner?.desktop?.replace(
                  "https://storage.bunnycdn.com/assets-erotichna",
                  "https://files-erotichna.b-cdn.net"
                )  || '/assets/images/placeholder-light.png'}
                width={1920}
                unoptimized={true}
                className="h-full w-auto object-cover"
                height={39}
                alt="Site Logo"
              />
            </div>
          )}
        </label>


        <input
          onChange={(e) => getImages(e, "desktop")}
          type="file"
          id="images"
          accept="image/png, image/jpeg, image/svg"
          className="hidden"
        />

        <label className=" text-[#232323] text-sm font-medium font-satoshi leading-[19px] my-3 block">
          Add Banner Poster (Mobile)
        </label>
        <label
          htmlFor="mobileimages"
          className="min-h-[238px] relative max-lg-mb:min-h-[159px] max-lg-mb:border-0 cursor-pointer bg-[#F7F8F9] rounded-xl flex items-center justify-center border border-dashed border-black border-opacity-20"
        >
          <Flex direction={"column"} justify={"center"} align={"center"}>
            <IconImageOutlined className="fill-heading w-5 h-5" />

            <p className="text-[#92929D] max-lg-mb:hidden text-center mt-1 mb-[5px] font-satoshi text-sm leading-6 font-normal">
              <u className="font-medium text-[#1B2432]">Click to upload</u> or
              drag and drop
            </p>
            <u className="font-medium text-[#1B2432] text-xsm leading-6 font-satoshi hidden max-lg-mb:block">
              Upload images
            </u>
            <span className="text-center font-satoshi block text-[10px] font-normal leading-[18.1px] text-[#92929D]">
              PNG, JPG, JPEG
            </span>
          </Flex>
          {formData?.banner?.mobile && (
            <button className="absolute right-2 bottom-2 z-[2] pointer-events-none
            text-center py-3 bg-black text-white px-5 rounded-lg mt-3 text-sm font-satoshi
            ">Change Image</button>

          )}
          {formData?.banner?.mobile && (
            <div className="rounded-xl overflow-hidden pointer-events-none absolute top-0 left-0  z-[1] w-full h-full  mb-3 flex justify-center items-center bg-[#F7F8F9]">
              <Image
                src={formData?.banner?.mobile?.replace(
                  "https://storage.bunnycdn.com/assets-erotichna",
                  "https://files-erotichna.b-cdn.net"
                )  || '/assets/images/placeholder-light.png'}
                width={1920}
                unoptimized={true}
                className="h-full w-auto object-cover"
                height={39}
                alt="Site Logo"
              />
            </div>
          )}
        </label>
        <input
          onChange={(e) => getImages(e, "mobile")}
          type="file"
          id="mobileimages"
          accept="image/png, image/jpeg, image/svg"
          className="hidden"
        />
      </Box>

      <InputDashboard
        name="video"
        placeholder="Add video id or link"
        label="Add Video"
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
      <Box className="mt-3">
        <InputDashboard

          name="bannerLink"
          placeholder="Add link to play button"
          label="Add Link"
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
        /></Box>
      {formData?.banner?.video?.link && (
        <Wrapper className="my-4">
          <Wrapper className="max-w-[500px]">
            <MuxVideo
              style={{ height: "100%", width: "100%", objectFit: "cover" }}
              src={formData?.banner?.video?.link}
              controls={true}
            />
          </Wrapper>
        </Wrapper>
      )}
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
