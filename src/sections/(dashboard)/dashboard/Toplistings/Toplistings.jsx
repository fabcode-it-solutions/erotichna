"use client";
import IconArrowForward from "@/assets/icons/IconArrowForward";
import IconDots from "@/assets/icons/IconDots";
import IconView from "@/assets/icons/Iconview";
import IconWatch from "@/assets/icons/IconWatch";
import Anchor from "@/components/ui/anchor/Anchor";
import Wrapper from "@/components/ui/wrapper/Wrapper";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Toplistings = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTop = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(
          "/api/admin/dashboard/topvideos?status=published&limit=5"
        );
        const json = await res.json();
        if (res.ok && json?.data) {
          console.log("Top Listing data -->", json);
          setItems(json.data);
        } else {
          setError(json.error || "Failed to load top listings");
        }
      } catch (e) {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchTop();
  }, []);

  const stripHtml = (html) => html?.replace(/<[^>]+>/g, "") || "";

  // -----------------------------
  // Skeleton Loader Component
  // -----------------------------
  const SkeletonCard = () => (
    <div className="bg-white p-2 w-full shadow-10xl-large rounded-lg flex items-center gap-4 animate-pulse">
      <div className="w-[90px] min-w-[90px] min-h-[75px] bg-gray-200 rounded"></div>

      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-40 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-56 mb-2"></div>

        <div className="flex gap-4 mt-3">
          <div className="h-3 bg-gray-200 rounded w-16"></div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>
  );

  return (
    <Wrapper className="p-5 rounded-lg border bg-gray-75 border-stroke max-w-[382px] max-lg-dx:max-w-[748px] w-full max-lg-mb:p-3 max-md-tab:max-w-full max-lg-mb:border-0 max-lg-mb:shadow-10xl-large max-lg-mb:bg-white">
      <Wrapper className="flex items-center justify-between py-[1px] mb-[22px] max-lg-mb:mb-3.5 max-lg-mb:py-0">
        <Wrapper className="text-heading text-base font-medium font-satoshi leading-[22px]">
          Top 5 listings
        </Wrapper>
        <button>
          <IconDots />
        </button>
      </Wrapper>

      <div className="max-h-[357px] w-full overflow-auto pb-6 flex-col justify-start items-start gap-2 flex hide-scroll-bar">
        {/* No Record */}
        {!loading && items?.length === 0 && (
          <div className="text-center text-[#151516] text-sm font-medium font-satoshi leading-5 tracking-[-0.14px] w-full py-2">
            No Record Found.
          </div>
        )}

        {/* Skeleton Loader */}
        {loading && [0, 1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}

        {/* Actual Data */}
        {!loading &&
          items?.map((item, i) => (
            <div
              key={item._id || i}
              className="bg-white p-2 w-full shadow-10xl-large rounded-lg flex items-center gap-4 relative cursor-pointer"
            >
              {/* <Link
                href={`/dashboard/videos/edit/${item?.seo?.permalink}`}
                className="absolute top-0 w-full h-full left-0"
              ></Link> */}

              <div className="w-[90px] min-w-[90px] min-h-[75px] bg-[#f5f4f2] rounded">
                <Image
                  src={
                    (item?.poster || "").replace(
                      "https://storage.bunnycdn.com/assets-erotichna",
                      "https://files-erotichna.b-cdn.net"
                    ) || "/assets/images/placeholder-dark.png"
                  }
                  width={90}
                  unoptimized={true}
                  height={75}
                  alt="Top listing"
                  className="w-full h-full min-h-[75px] object-cover rounded"
                />
              </div>

              <div>
                <div className="text-[#151516] text-sm font-medium font-satoshi leading-4 tracking-[-0.14px]">
                  {item?.title}
                  {item?.model?.length > 0
                    ? ` - ${item?.model?.[0]?.name}`
                    : ""}
                </div>

                {item?.description && (
                  <p className="text-[#7f7f7f] text-xs font-medium font-satoshi my-1 leading-4 tracking-[-0.14px]">
                    {stripHtml(item.description).length > 120
                      ? stripHtml(item.description).slice(0, 120) + "..."
                      : stripHtml(item.description)}
                  </p>
                )}

                <div className="flex gap-[15px] mt-2">
                  <span className="text-[#7f7f7f] text-xs font-normal font-satoshi leading-3 flex items-center gap-2">
                    <IconView className="w-4 h-4" />
                    <span className="text-[#232323]">
                      {item?.videoView || 0}
                    </span>
                  </span>

                  <span className="text-[#7f7f7f] text-xs font-normal font-satoshi leading-3 flex items-center gap-2">
                    <IconWatch className="w-4 h-4" />
                    <span className="text-[#232323]">
                      {item?.video?.duration || "--:--"}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>

      <Wrapper className="pt-4 border-t border-stroke border-opacity-50 mx-[-20px]">
        <Anchor
          to="/dashboard/videos"
          buttonStyle="link"
          className="!min-h-[26px] !min-w-[auto]"
        >
          View all <IconArrowForward />
        </Anchor>
      </Wrapper>
    </Wrapper>
  );
};

export default Toplistings;
