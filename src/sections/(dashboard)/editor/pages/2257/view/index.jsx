/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import HeaderHeading from "@/components/dashboard/HeaderHeading/HeaderHeading";
import InputDashboard from "@/components/dashboard/InputDashboard/InputDashboard";
import MobileHeader from "@/components/dashboard/MobileHeader/MobileHeader";
import RichTextEditor from "@/components/dashboard/RichTextEditor/RichTextEditor";
import Tags from "@/components/dashboard/Tags/Tags";
import Loader from "@/components/global/Loading/Loader";
import ToastError from "@/components/global/Toasts/ToastError";
import ToastSuccess from "@/components/global/Toasts/ToastSuccess";
import Wrapper from "@/components/ui/wrapper/Wrapper";
import useAuth from "@/contexts/auth/AuthProvider";
import { CreateSlug } from "@/utils/createSlug";
import { Box } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Index = ({ pageData, slug }) => {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState(null);
  const [data, setData] = useState(null);
  const [success, setSuccess] = useState({});
  const [error, setError] = useState({});
  const [loader, setLoader] = useState(false);

  const updatePageContent = async (token) => {
    const method = data ? "PUT" : "POST";
    if (!formData) {
      setError({
        active: true,
        message: "Nothing to update.",
      });
      return;
    }
    setLoader(true);
    try {
      let handle = data ? slug : formData?.seo?.permalink;
      if (formData?.seo?.permalink) {
        const checkingHandle = await fetch(
          "/api/admin/pages/handle-check?slug=" + formData?.seo?.permalink,
          {
            method: "GET",
            headers: { "Content-Type": "application/json", "x-token": token },
          }
        );
        const result = await checkingHandle.json();
        if (result?.id) {
          alert(
            "You already have a page with this handle. /n You handle is changed to " +
              result?.id
          );
          setFormData((prev) => ({
            ...prev,
            seo: {
              ...prev?.formData?.seo,
              title:
                formData?.seo?.title ||
                formData?.title ||
                data?.seo?.title ||
                "",
              description:
                formData?.seo?.description || data?.seo?.description || "",
              keywords: formData?.seo?.keywords || data?.seo?.keywords || [],
              permalink: CreateSlug(result?.id),
            },
          }));
          handle = result?.id;
        }
      }

      const response = await fetch("/api/admin/pages", {
        method,
        headers: { "Content-Type": "application/json", "x-token": token },
        body: JSON.stringify({
          handle: handle,
          ...formData,
        }),
      });

      const result = await response.json();
      if (!result.error) {
        router.push("/dashboard/editor/pages");
        setData(result.result);
        setFormData(null);
        setSuccess({
          active: true,
          message: "Page Data is Successfully updated.",
        });
      }
    } catch (error) {
      console.error("Error updating page content:", error);
      setError({
        active: true,
        message: "Error updating page content.",
      });
    } finally {
      setTimeout(() => {
        setLoader(false);
      }, 1000);
    }
  };
  useEffect(() => {
    setData(pageData);
  }, [pageData]);
  return (
    <div className="">
      {loader && <Loader message="Updating Page Data." />}
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
      <div className="justify-between flex items-start">
        <HeaderHeading
          title={data?.title ? "Edit Page" : "Add Page"}
          description={`Edit page ${data?.title}` || "Create a new page"}
        />
        <MobileHeader heading={data?.title || "Add Page"} />
        <button
          onClick={() => updatePageContent(user?.userID)}
          type="button"
          className="text-center max-md-tab:hidden py-3 bg-black text-white px-5 rounded-lg mt-3 text-sm font-satoshi"
        >
          Save Changes
        </button>
      </div>
      <form className="pt-8">
        <InputDashboard
          required={true}
          name="title"
          placeholder="Add Title Here"
          label="Add Title*"
          className=""
          value={formData?.title || data?.title || ""}
          setInputData={(e) =>
            setFormData((prev) => ({
              ...prev,
              title: e.target.value,
              seo: {
                ...prev?.seo,
                title: e.target.value,
                permalink: CreateSlug(e.target.value),
              },
            }))
          }
        />

        <Box className=" max-lg-mb:max-w-full w-full pt-[10px]">
          <label className=" text-[#232323] text-sm font-medium block font-satoshi leading-[19px] mb-3">
            Add Description
          </label>
          <RichTextEditor
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                description: e,
              }))
            }
            value={formData?.description || data?.description || ""}
          />
        </Box>
      </form>

      <div className="relative">
        <Wrapper className="mt-8  border-t border-stroke">
          <Box
            className={`pt-8 pb-6 font-satoshi relative max-lg-mb:w-full text-base font-medium leading-6 text-[#242424] text-opacity-90 !flex gap-1.5 items-center
            max-lg-mb:text-[15px] max-lg-mb:leading-[22px]
           `}
          >
            SEO
          </Box>
          <InputDashboard
            required={true}
            name="meta-title"
            placeholder="Add a title"
            label="Meta Title"
            value={
              formData?.seo?.title || formData?.title || data?.seo?.title || ""
            }
            setInputData={(e) =>
              setFormData((prev) => ({
                ...prev,
                seo: {
                  ...prev?.formData?.seo,
                  title: e.target.value,
                  permalink:
                    formData?.seo?.permalink ||
                    CreateSlug(formData?.title || "") ||
                    data?.seo?.permalink,
                  description:
                    formData?.seo?.description || data?.seo?.description || "",
                  keywords:
                    formData?.seo?.keywords || data?.seo?.keywords || [],
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
              value={
                formData?.seo?.permalink ||
                CreateSlug(formData?.title || "") ||
                data?.seo?.permalink ||
                ""
              }
              setInputData={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  seo: {
                    ...prev?.formData?.seo,
                    title:
                      formData?.seo?.title ||
                      formData?.title ||
                      data?.seo?.title ||
                      "",
                    description:
                      formData?.seo?.description ||
                      data?.seo?.description ||
                      "",
                    keywords:
                      formData?.seo?.keywords || data?.seo?.keywords || [],
                    permalink: CreateSlug(e.target.value),
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
              value={formData?.seo?.description || data?.seo?.description || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  seo: {
                    ...prev?.formData?.seo,
                    title:
                      formData?.seo?.title ||
                      formData?.title ||
                      data?.seo?.title ||
                      "",
                    permalink:
                      formData?.seo?.permalink ||
                      CreateSlug(formData?.title || "") ||
                      data?.seo?.permalink,
                    description: e.target.value,
                    keywords:
                      formData?.seo?.keywords || data?.seo?.keywords || [],
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
              selectAll={{
                tags: formData?.seo?.keywords || data?.seo?.keywords || [],
              }}
              setSelectAll={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  seo: {
                    ...prev?.formData?.seo,
                    title:
                      formData?.seo?.title ||
                      formData?.title ||
                      data?.seo?.title ||
                      "",
                    permalink:
                      formData?.seo?.permalink ||
                      CreateSlug(formData?.title || "") ||
                      data?.seo?.permalink,
                    description:
                      formData?.seo?.description ||
                      data?.seo?.description ||
                      "",
                    keywords: e,
                  },
                }))
              }
            />
          </Box>
        </Wrapper>
      </div>
      <button
        onClick={() => updatePageContent(user?.userID)}
        type="button"
        className="text-center max-md-tab:block hidden w-full py-3 bg-black text-white px-5 rounded-lg mt-3 text-sm font-satoshi"
      >
        Save Changes
      </button>
    </div>
  );
};

export default Index;
