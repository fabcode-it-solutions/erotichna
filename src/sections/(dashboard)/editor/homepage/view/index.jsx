"use client";
import React, { useEffect, useRef, useState } from "react";
import BannerSection from "../BannerSection";
import HeaderHeading from "@/components/dashboard/HeaderHeading/HeaderHeading";
import IconArrowForward from "@/assets/icons/IconArrowForward";
import TopVideos from "../TopVideos";
import SingleImage from "../SingleImage";
import LatestVideos from "../LatestVideos";
import Performers from "../Performers";
import Upcoming from "../Upcoming";
import SeoFields from "@/app/(dashboard)/editor/SeoFields";
import ToastSuccess from "@/components/global/Toasts/ToastSuccess";
import Loader from "@/components/global/Loading/Loader";
import ToastError from "@/components/global/Toasts/ToastError";
import MobileHeader from "@/components/dashboard/MobileHeader/MobileHeader";
import SingleImageSecond from "../SingleImageSecond";
import { createSwapy } from "swapy";
import IconDragDots from "@/assets/icons/IconDragDots";
import Richtext from "../Richtext";

const Index = () => {
  const [seofields, setSeofields] = useState({});
  const [success, setSuccess] = useState({});
  const [error, setError] = useState({});
  const [loader, setLoader] = useState(false);
  const [orderChanged, setOrderChanged] = useState(false);

  const [activeSection, setActiveSection] = useState({
    label: "Banner",
    value: "banner",
    section: <BannerSection />,
  });
  const getFieldSEO = async () => {
    try {
      const response = await fetch(`/api/admin/homepage?section=seo`);
      const data = await response.json();
      if (!data.error) {
        setSeofields(data.data);
      }
    } catch (error) {
      console.error(`Error fetching data:`, error);
    }
  };
  useEffect(() => {
    getFieldSEO();
  }, []);
  const updateSeo = async (e, formData) => {
    e.preventDefault();
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
      console.log(error);

      setLoader(false);
    } finally {
      console.log("dsgsd");
      setLoader(false);
    }
  };

  const swapy = useRef(null);
  const container = useRef(null);

  useEffect(() => {
    if (container.current) {
      swapy.current = createSwapy(container.current, {
        dragAxis: "y",
      });
      swapy.current.onSwap((event) => {
        setOrderChanged(true);
      });
    }

    return () => {
      swapy.current?.destroy();
    };
  }, []);
  const updateOrder = async (e) => {
    e.preventDefault();
    const orders = swapy.current.slotItemMap().asArray;

    try {
      setLoader(true);
      const response = await fetch("/api/admin/homepage/order", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order: orders,
        }),
      });
      const data = await response.json();
      if (!data?.error) {
        setLoader(false);
        setSuccess({
          active: true,
          message: "Sections order updated.",
        });
        setOrderChanged(false);
      } else {
        setError({
          active: true,
          message: data.error,
        });
        setLoader(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };
  const [sections, setSections] = useState([
    {
      label: "Banner",
      value: "banner",
      section: <BannerSection />,
    },

    {
      label: "Top Videos",
      value: "topVideos",
      section: <TopVideos />,
    },
    {
      label: "Single Image",
      value: "singleImage",
      section: <SingleImage />,
    },
    {
      label: "Latest Videos",
      value: "latestVideos",
      section: <LatestVideos />,
    },
    {
      label: "Performers",
      value: "performers",
      section: <Performers />,
    },
    {
      label: "Single Image",
      value: "singleImageSecond",
      section: <SingleImageSecond />,
    },
    {
      label: "Upcoming Scene",
      value: "upcoming",
      section: <Upcoming />,
    },
    {
      label: "SEO",
      value: "seo",
      section: <SeoFields formData={seofields} updateSection={updateSeo} />,
    },
  ]);
  const setHomeData = async () => {
    try {
      const response = await fetch("/api/admin/homepage/order");
      const data = await response.json();
      if (!data.error) {
        const sortedSections = sections
          .filter((item) => data.data[item.value])
          .sort((a, b) => {
            const orderA = data.data[a.value].order;
            const orderB = data.data[b.value].order;
            return orderA - orderB;
          });
        sortedSections.push(sections.find((item) => item.value === "seo"));

        setSections(sortedSections);
      } else {
        setError({
          active: true,
          message: data.error,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };
  useEffect(() => {
    setHomeData();
  }, []);
  return (
    <div>
      {loader && <Loader message="Updating SEO fields." />}
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
      <HeaderHeading title="Home Page" description="Edit homepage sections" />
      <MobileHeader heading="Home Page" />
      <div className="flex border-t border-stroke py-6 my-6 gap-0 max-md-tab:flex-wrap max-md-tab:border-0 max-md-tab:mt-0">
        <div className="flex-1 max-w-[480px] bg-warm p-4 max-md-tab:max-w-full max-md-tab:w-full max-md-tab:flex-none">
          <ul
            className="w-full sticky top-3 border-b border-stroke"
            ref={container}
          >
            <div className="p-0  min-h-[44px]  text-heading text-xl font-medium max-lg-mb:text-lg font-satoshi leading-7 mb-4 flex justify-between items-center">
              All Sections
              <div className="flex gap-2">
              {orderChanged && (
                <button
                  onClick={(e) => updateOrder(e)}
                  type="button"
                  className="text-center py-3 bg-black  text-white px-5 rounded-lg text-sm font-satoshi"
                >
                  Update Order
                </button>
              )}
              {orderChanged && (
                <button
                  onClick={(e) => setOrderChanged(false)}
                  type="button"
                  className="text-center py-3 bg-red-500  text-white px-5 rounded-lg text-sm font-satoshi"
                >
                  Cancel
                </button>
              )}
              </div>
            </div>
            {sections.length > 0 &&
              sections.map((item, i) =>
                sections.length === i + 1 ? (
                  <li
                    key={i}
                    onClick={() => setActiveSection(item)}
                    className={`flex  ${
                      activeSection?.value == item.value ? "bg-white" : ""
                    } items-center justify-between gap-4  cursor-pointer   border-t border-stroke`}
                  >
                    <div className="w-full p-3 flex items-center justify-between">
                      {item?.label} <IconArrowForward />{" "}
                    </div>
                  </li>
                ) : (
                  <li
                    data-swapy-slot={i}
                    key={i}
                  
                    className={`flex items-center justify-between gap-4  cursor-pointer   border-t border-stroke`}
                  >
                    <div
                      data-swapy-item={item.value}
                      onClick={() => setActiveSection(item)}
                      className={`w-full p-3 flex items-center justify-between
                         ${
                      activeSection?.value == item.value ? "bg-white" : ""
                    }
                        `}
                    >
                      <span
                        data-swapy-handle
                        className="flex items-center gap-2"
                      >
                        <IconDragDots className="cursor-move" /> {item?.label}
                      </span>
                      <IconArrowForward />{" "}
                    </div>
                  </li>
                )
              )}
          </ul>
        </div>
        <div className="flex-[2] border border-warm p-4 relative max-md-tab:max-w-full max-md-tab:w-full max-md-tab:flex-none">
          <h2
            className="font-satoshi relative max-lg-mb:w-full text-xl font-medium leading-6 text-[#242424] text-opacity-90 !flex gap-1.5 items-center
            max-lg-mb:text-[15px] max-lg-mb:leading-[22px] mb-6
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
