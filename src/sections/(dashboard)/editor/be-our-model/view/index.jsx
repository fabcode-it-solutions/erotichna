/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import BannerSection from "../BannerSection";
import HeaderHeading from "@/components/dashboard/HeaderHeading/HeaderHeading";
import SeoFields from "@/app/(dashboard)/editor/SeoFields";
import IconArrowForward from "@/assets/icons/IconArrowForward";
import useAdmin from "@/contexts/admin/AdminDataProvider";
import Loader from "@/components/global/Loading/Loader";
import ToastSuccess from "@/components/global/Toasts/ToastSuccess";
import ToastError from "@/components/global/Toasts/ToastError";
import MobileHeader from "@/components/dashboard/MobileHeader/MobileHeader";

const Index = () => {
  const { getBeOurModelDataAPI, beOurModelData, setBeOurModelData } =
    useAdmin();
  const [seofields, setSeofields] = useState(false);
  const [success, setSuccess] = useState({});
  const [error, setError] = useState({});
  const [loader, setLoader] = useState(false);
  const [activeSection, setActiveSection] = useState({
    label: "Banner",
    value: "banner",
    section: (
      <BannerSection
        beOurModelData={beOurModelData}
        getBeOurModelDataAPI={getBeOurModelDataAPI}
        setBeOurModelData={setBeOurModelData}
      />
    ),
  });
  useEffect(() => {
    getBeOurModelDataAPI();
  }, []);
  const updateSeo = async (e, formData) => {
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
      if (!data?.error) {
        setLoader(false);
        setSuccess({
          active: true,
          message: "Seo fields updated.",
        });
        setHomeData();
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
        message: "Something went wrong! Try again later.",
      });
      setLoader(false);
    } finally {
      setLoader(false);
    }
  };
  const sections = [
    {
      label: "Banner",
      value: "banner",
      section: (
        <BannerSection
          beOurModelData={beOurModelData}
          getBeOurModelDataAPI={getBeOurModelDataAPI}
          setBeOurModelData={setBeOurModelData}
        />
      ),
    },
    {
      label: "SEO",
      value: "seo",
      section: (
        <SeoFields
          formData={seofields || beOurModelData}
          updateSection={updateSeo}
        />
      ),
    },
  ];
  return (
    <div>
      {loader && <Loader message="Updating Fields..." />}
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
      <HeaderHeading
        title="Be Our Model"
        description="Edit Be Our Model sections"
      />
      <MobileHeader heading='Be Our Model' />
      <div className="flex border-t border-stroke py-6 my-6 gap-0 max-md-tab:flex-wrap max-md-tab:border-0 max-md-tab:mt-0">
        <div className="flex-1 max-w-[480px] bg-warm p-4 max-md-tab:max-w-full max-md-tab:w-full max-md-tab:flex-none">
          <ul className="w-full sticky top-3 border-b border-stroke">
            <div className="p-0  text-heading text-xl font-medium max-lg-mb:text-lg font-satoshi leading-7 mb-4">
              All Sections
            </div>
            {sections.length > 0 &&
              sections.map((item, i) => (
                <li
                  key={i}
                  onClick={() => setActiveSection(item)}
                  className={`flex items-center justify-between gap-4 p-3 cursor-pointer  ${
                    activeSection?.value == item.value ? "bg-white" : ""
                  }  border-t border-stroke`}
                >
                  {item?.label} <IconArrowForward />
                </li>
              ))}
          </ul>
        </div>
        <div className="flex-[2] border border-warm p-4 relative max-md-tab:max-w-full max-md-tab:w-full max-md-tab:flex-none">
          <h2
            className="font-satoshi relative max-lg-mb:w-full text-xl font-medium leading-6 text-[#242424] text-opacity-90 !flex gap-1.5 items-center
            max-lg-mb:text-[24px] max-lg-mb:leading-[22px] mb-6
            "
          >
            {activeSection?.label}
          </h2>

          {activeSection?.section}
        </div>
      </div>
    </div>
  );
};

export default Index;
