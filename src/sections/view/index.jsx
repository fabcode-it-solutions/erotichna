/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Image from "next/image";
import MainVideoBanner from "../MainVideoBanner";
import TopVideo from "../TopVideo";
import "./style.css";
import React, { useMemo, memo } from "react";
import Link from "next/link";
import Performers from "../Performers";
import UpcomingScene from "../UpcomingScene";
import useTheme from "@/contexts/theme/ThemeProvider";
import useAdmin from "@/contexts/admin/AdminDataProvider";

// Memoized Image component to avoid unnecessary re-renders
const OptimizedImage = memo(
  ({ src, alt, width, height, className, desktopSrc, mobileSrc }) => {
    const optimizedDesktopSrc = useMemo(
      () =>
        desktopSrc?.replace(
          "https://storage.bunnycdn.com/assets-erotichna",
          "https://files-erotichna.b-cdn.net"
        ) || "/assets/images/Backrouns_image.jpg",
      [desktopSrc]
    );

    const optimizedMobileSrc = useMemo(
      () =>
        mobileSrc?.replace(
          "https://storage.bunnycdn.com/assets-erotichna",
          "https://files-erotichna.b-cdn.net"
        ) ||
        optimizedDesktopSrc ||
        "/assets/images/Backrouns_image.jpg",
      [mobileSrc, optimizedDesktopSrc]
    );

    return (
      <>
        <Image
          src={optimizedDesktopSrc}
          unoptimized={true}
          width={width}
          height={height}
          alt={alt}
          className={`w-full h-full object-cover mb-2xl:hidden ${className}`}
        />
        <Image
          src={optimizedMobileSrc}
          unoptimized={true}
          width={width}
          height={height}
          alt={alt}
          className={`w-full h-full object-cover mb-2xl:block hidden ${className}`}
        />
      </>
    );
  }
);

OptimizedImage.displayName = "OptimizedImage";

// Memoized header section to avoid re-renders when count changes
const HeaderSection = memo(({ count }) => (
  <div className="w-full flex justify-center">
    <div className="bg-black pt-16 ">
      <div className="max-w-[951px] px-4 mx-auto flex max-lg-mb:flex-wrap gap-4 justify-between items-center pb-6 border-b border-[#C4AE7B]">
        <h2 className="font-bodoni text-[#C4AE7B] text-3xl max-w-[200px]">
          Better than porn.
        </h2>
        <p className="max-w-[430px] text-[#C4AE7B] font-gambetta text-lg font-medium">
          Research indicates that exposure to erotic content can positively
          influence one&apos;s sexual mindset.
        </p>
      </div>
      <h3 className="font-bodoni text-[#C4AE7B] text-3xl  text-center pt-6 pb-12">
        ({count || 0}) Videos Now Online
      </h3>
    </div>
  </div>
));

HeaderSection.displayName = "HeaderSection";

const Index = ({ pageData, count, allposts = [] }) => {
  const {
    bannerData,
    topVideosData,
    latestVideosData,
    performersData,
    singleImage,
    upcomingData,
    singleImageSecond,
  } = useTheme();

  // Memoize sorted videos to avoid re-sorting on every render
  const sortedTopVideos = useMemo(
    () => pageData?.topVideos?.videos?.sort((a, b) => a.order - b.order) || [],
    [pageData?.topVideos?.videos]
  );

  const sortedPerformers = useMemo(
    () => pageData?.performers?.items?.sort((a, b) => a.order - b.order) || [],
    [pageData?.performers?.items]
  );

  // Memoize conditional rendering checks
  const hasBanner = useMemo(() => pageData?.banner, [pageData?.banner]);
  const hasTopVideos = useMemo(
    () => pageData?.topVideos?.videos?.length > 0,
    [pageData?.topVideos?.videos]
  );
  const hasSingleImage = useMemo(
    () => pageData?.singleImage?.desktop,
    [pageData?.singleImage?.desktop]
  );
  const hasPosts = useMemo(() => allposts.length > 0, [allposts.length]);
  const hasSingleImageSecond = useMemo(
    () => pageData?.singleImageSecond?.desktop,
    [pageData?.singleImageSecond?.desktop]
  );
  const hasUpcoming = useMemo(() => pageData?.upcoming, [pageData?.upcoming]);

  // Memoize order values
  const bannerOrder = useMemo(
    () => pageData?.banner?.order ?? 0,
    [pageData?.banner?.order]
  );
  const topVideosOrder = useMemo(
    () => pageData?.topVideos?.order ?? 3,
    [pageData?.topVideos?.order]
  );
  const singleImageOrder = useMemo(
    () => pageData?.singleImage?.order ?? 4,
    [pageData?.singleImage?.order]
  );
  const latestVideosOrder = useMemo(
    () => pageData?.latestVideos?.order ?? 5,
    [pageData?.latestVideos?.order]
  );
  const performersOrder = useMemo(
    () => pageData?.performers?.order ?? 6,
    [pageData?.performers?.order]
  );
  const singleImageSecondOrder = useMemo(
    () => pageData?.singleImageSecond?.order ?? 7,
    [pageData?.singleImageSecond?.order]
  );
  const upcomingOrder = useMemo(
    () => pageData?.upcoming?.order ?? 8,
    [pageData?.upcoming?.order]
  );

  return (
    <div className="flex flex-wrap overflow-hidden">
      {hasBanner && (
        <div className="w-full" style={{ order: bannerOrder }}>
          <MainVideoBanner data={pageData} />
          <HeaderSection count={count} />
        </div>
      )}

      {hasTopVideos && (
        <div className="w-full" style={{ order: topVideosOrder }}>
          <TopVideo
            title={pageData?.topVideos?.title}
            showAllVideoButton={false}
            videos={sortedTopVideos}
          />
        </div>
      )}

      {hasSingleImage && (
        <div className="w-full" style={{ order: singleImageOrder }}>
          <Link href={pageData?.singleImage?.link || ""}>
            <OptimizedImage
              desktopSrc={pageData?.singleImage?.desktop}
              mobileSrc={pageData?.singleImage?.mobile}
              alt="Promotional banner"
              width={1920}
              height={792}
            />
          </Link>
        </div>
      )}

      {hasPosts && (
        <div className="w-full" style={{ order: latestVideosOrder }}>
          <TopVideo
            showAllVideoButton={false}
            title={pageData?.latestVideos?.title}
            videos={allposts}
            showAllVideo={pageData?.latestVideos}
          />
        </div>
      )}

      <div className="w-full" style={{ order: performersOrder }}>
        <Performers
          showAllVideo={true}
          title={pageData?.performers?.title}
          items={sortedPerformers}
        />
      </div>

      {hasSingleImageSecond && (
        <div className="w-full" style={{ order: singleImageSecondOrder }}>
          <Link href={pageData?.singleImageSecond?.link || ""}>
            <OptimizedImage
              desktopSrc={pageData?.singleImageSecond?.desktop}
              mobileSrc={pageData?.singleImageSecond?.mobile}
              alt="Promotional banner"
              width={1920}
              height={792}
            />
          </Link>
        </div>
      )}

      {hasUpcoming && (
        <div className="w-full" style={{ order: upcomingOrder }}>
          <UpcomingScene data={pageData?.upcoming} />
        </div>
      )}
    </div>
  );
};

export default memo(Index);
