import Index from "@/sections/(main)/videos/videoDetailPage";
import React from "react";
import MainWrapper from "../../MainWrapper";
import { getVideoSEO } from "@/utils/getSeo";
import { GetSession } from "@/app/api/auth/login/route";
import { notFound } from "next/navigation";
import videoModel from "@/model/admin/videoModel";
import connect from "@/libs/mongo";

export const revalidate = 240;
export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  try {
    await connect();
    const sortedData = await videoModel.find().select("slug");
    const slugs = sortedData.map((item) => ({
      slug: item.slug,
    }));
    return slugs;
  } catch (error) {
    console.error("Error in generateStaticParams:", error);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const seofields = await getVideoSEO(slug);

  if (!seofields) {
    return {
      title: "Not Found | Erotichna",
      description: "This video page does not exist.",
    };
  }

  return {
    title: `${seofields.title} | Erotichna`,
    description: seofields.description,
    keywords: seofields.keywords?.join(", ") || "",
    openGraph: {
      title: seofields.title,
      description: seofields.description,
    },
  };
}

const VideoPage = async ({ params }) => {
  const { slug } = await params;
  const session = await GetSession();

  const res = await fetch(
    `${
      process.env.NODE_ENV != "production"
        ? process.env.SITE_URL
        : "https://erotichna.com"
    }/api/admin/post?edit=${slug}`,
    {
      method: "GET",
      headers: {
        "x-token": session?.userID || "",
      },
      cache: "no-store", // Ensures fresh data on every request (SSR)
    }
  );

  const videoData = await res.json();

  if (videoData?.error) {
    notFound();
  }
  return (
    <MainWrapper>
      <Index slug={slug} videoData={videoData} />
    </MainWrapper>
  );
};

export default VideoPage;
