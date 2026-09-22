"use client";
import InputDashboard from "@/components/dashboard/InputDashboard/InputDashboard";
import Tags from "@/components/dashboard/Tags/Tags";
import { CreateSlug } from "@/utils/createSlug";
import { Box } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";

const SeoFields = ({
  formData,  
  updateSection,
  btnStyle,
  btnLoading,
}) => {
  const [data, setData] = useState({});
  useEffect(() => {
    if (formData) {
      setData(formData);
    }
  }, [formData]);
  return (
    <form className="" onSubmit={(e) => updateSection(e, data)}>
      <button
        type="submit"
        className={`${
          btnLoading ? "opacity-30 pointer-events-none" : ""
        } text-center py-3 bg-black absolute top-0 right-4 text-white px-5 rounded-lg mt-3 text-sm font-satoshi ${
          btnStyle || ""
        }`}
      >
        {btnLoading ? "Updating" : "Update"}
      </button>
      <InputDashboard
        required={true}
        name="meta-title"
        placeholder="Add a title"
        label="Meta Title"
        value={data?.seo?.title || ""}
        setInputData={(e) =>
          setData((prev) => ({
            ...prev,
            seo: {
              ...prev.seo,
              title: e.target.value,
            },
          }))
        }
      />
      <Box className=" max-lg-mb:max-w-full w-full mt-4">
        <InputDashboard
          required={true}
          name="meta-permalink"
          placeholder="Add a Permalink"
          label="Permalink"
          value={data?.seo?.permalink || ""}
          setInputData={(e) =>
            setData((prev) => ({
              ...prev,
              seo: {
                ...prev.seo,
                permalink: e.target.value,
              },
            }))
          }
        />
      </Box>
      <Box className=" max-lg-mb:max-w-full w-full mt-4">
        <label className=" text-[#232323] text-sm font-medium block font-satoshi leading-[19px] mb-3">
          Meta Description
        </label>
        <textarea
          maxLength={160}
          value={data?.seo?.description || ""}
          onChange={(e) =>
            setData((prev) => ({
              ...prev,
              seo: {
                ...prev.seo,
                description: e.target.value,
              },
            }))
          }
          className="border border-stroke rounded-lg min-h-[151px] py-3 px-[15px]   w-full
   font-satoshi placeholder:text-text-input placeholder:font-normal leading-normal text-sm font-medium text-[#242424]"
          placeholder="Meta Description"
        ></textarea>
      </Box>
      <Box className=" max-lg-mb:max-w-full w-full mt-4">
        <label className=" text-[#232323] text-sm font-medium block font-satoshi leading-[19px] mb-3">
          Keywords
        </label>
        <Tags
          selectAll={{ tags: data?.seo?.keywords || [] }}
          setSelectAll={(e) =>
            setData((prev) => ({
              ...prev,
              seo: {
                ...prev.seo,
                keywords: e,
              },
            }))
          }
        />
      </Box>
    </form>
  );
};

export default SeoFields;
