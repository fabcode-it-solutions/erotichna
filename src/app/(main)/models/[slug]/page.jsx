import Index from "@/sections/(main)/models/modelDetialPage";
import React from "react";
import MainWrapper from "../../MainWrapper";
import { getModelSEO } from "@/utils/getSeo";
import models from "@/model/admin/models";
import connect from "@/libs/mongo";

export const revalidate = 240;
export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  try {
    await connect();
    const sortedData = await models.find().select("seo.permalink");
    const slugs = sortedData.map((item) => ({
      slug: item.seo.permalink,
    }));

    return slugs;
  } catch (error) {
    console.error("Error in generateStaticParams:", error);
    return [];
  }
}

export async function generateMetadata({ params, searchParams }, parent) {
  const id = await params;

  const seofields = await getModelSEO(id?.slug);

  return {
    title: seofields?.title + " | Erotichna",
    description: seofields?.description,
    keywords: seofields?.keywords.toString(),
    openGraph: {
      title: seofields?.title,
      description: seofields?.description,
    },
  };
}

const page = async ({ params }) => {
  return (
    <MainWrapper>
      <Index />
    </MainWrapper>
  );
};

export default page;
