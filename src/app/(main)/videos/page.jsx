import Index from "@/sections/(main)/videos/view";
import React, { Suspense } from "react";

export const metadata = {
  title: "Videos | Erotichna",
  description: "",
};
export default async function Page({ searchParams }) {
  const { page } = await searchParams;

  const response = await fetch(
    `${
      process.env.NODE_ENV != "production"
        ? process.env.SITE_URL
        : "https://erotichna.com"
    }/api/admin/post?sort=latest-scenes&filter=Category&query=null&limit=15&skip=${
      parseInt(page) > 0 ? parseInt(page) * 15 : parseInt(0)
    }`
  );
  const data = await response.json();

  return (
    <div className="bg-black">
      <Suspense>
        <Index videosData={data} />
      </Suspense>
    </div>
  );
}
