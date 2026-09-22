import Index from "@/sections/view";
import MainWrapper from "./(main)/MainWrapper";
import { getHomeSEO } from "@/utils/getSeo";
export const revalidate = 240;
export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const seofields = await getHomeSEO("seo");

  return {
    title: seofields?.title,
    description: seofields?.description,
    keywords: seofields?.keywords?.toString(),
    openGraph: {
      title: seofields?.title,
      description: seofields?.description,
    },
  };
}

export default async function Page() {
  // ✅ Fetch all data in parallel
  const [homeRes, countRes, videosRes] = await Promise.all([
    fetch(
      `${
        process.env.NODE_ENV != "production"
          ? process.env.SITE_URL
          : "https://erotichna.com"
      }/api/admin/homepage`,
      {
        next: {
          tags: ["home"],
          revalidate: 60,
        },
      }
    ),
    fetch(
      `${
        process.env.NODE_ENV != "production"
          ? process.env.SITE_URL
          : "https://erotichna.com"
      }/api/admin/post/count`,
      {
        next: {
          tags: ["home"],
          revalidate: 60,
        },
      }
    ),
    fetch(
      `${
        process.env.NODE_ENV != "production"
          ? process.env.SITE_URL
          : "https://erotichna.com"
      }/api/admin/post?limit=6&skip=0&status=published&card=customer&categories=00`,
      {
        next: {
          tags: ["home"],
          revalidate: 60,
        },
      }
    ),
  ]);

  // ✅ Parse JSON responses
  const [homeData, countData, videosData] = await Promise.all([
    homeRes.json(),
    countRes.json(),
    videosRes.json(),
  ]);

  return (
    <MainWrapper>
      <Index
        pageData={homeData?.data}
        count={countData?.count}
        allposts={videosData?.data || []}
      />
    </MainWrapper>
  );
}
