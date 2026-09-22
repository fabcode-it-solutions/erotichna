import React from "react";
import Index from "@/sections/(main)/pages/2257";
import MainWrapper from "../../MainWrapper";
import { getPageContent } from "@/utils/getPage";
import { notFound } from "next/navigation";

export async function generateMetadata({ params, searchParams }, parent) {
  const id = await params;
  const pageData = await getPageContent(id?.slug);
  return {
    title: pageData.seo.title + " | Erotichna",
    description: pageData.seo.description,
    keywords: pageData.seo?.keywords.toString(),
    openGraph: {
      title: pageData.seo.title + " | Erotichna",
      description: pageData.seo.description,
    },
  };
}

const page = async ({ params }) => {
  const slug = (await params).slug;
  const pageData = await getPageContent(slug);
  if (!pageData) {
    return notFound();
  }

  return (
    <MainWrapper>
      <Index data={pageData} />
    </MainWrapper>
  );
};

export default page;
