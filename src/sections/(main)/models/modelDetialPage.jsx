/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Header from "@/layouts/(main)/header/Header";
import React, { useEffect, useState } from "react";
import TopVideo from "./Videos";
import UpcomingScene from "./Upcoming";
import { useParams } from "next/navigation";
import useAuth from "@/contexts/auth/AuthProvider";
import Wrapper from "@/components/ui/wrapper/Wrapper";
import Link from "next/link";
import WishlistButton from "@/components/wishlist/button/WishlistButton";
const Index = () => {
  const { user } = useAuth();
  const params = useParams();
  const [data, setData] = useState(null);
  const [modelVideos, setModelVideos] = useState(null);
  const [error, setError] = useState(200);
  useEffect(() => {
    const fetchData = async () => {
      const url = `/api/admin/models/edit/${params.slug}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "X-TOKEN": user.userID || null,
          },
        });

        const result = await response.json();
        setError(response.status);

        if (!result.error) {
          setData(result.data);
          fetchModelVideos(result.data.title, result.data.id);
        } else {
        }
      } catch (err) {}
    };

    fetchData();
  }, [params.slug, user]);

  const fetchModelVideos = async (title, id) => {
    const url = `/api/admin/model-videos?title=${title}&id=${id}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch model data");
      }

      const result = await response.json();
      setModelVideos(result.data);
    } catch (err) {}
  };
  if (error == 404) {
    return (
      <Wrapper className="bg-black min-h-[calc(100vh-252px)] flex justify-center items-center">
        <Wrapper>
          <div className="text-center font-bodoni text-9xl text-white">404</div>
          <div className="text-center font-gambetta text-2xl text-white">
            Model Not found.
          </div>
          <div className="flex gap-2 max-md-tab:flex-wrap mt-3 justify-center">
            <Link
              href="/"
              className="bg-[#ff4040] uppercase flex items-center justify-center text-white text-base font-medium px-10 py-1 min-h-[48px]
  transition-all duration-300 hover:bg-white hover:text-black
  tab-lg:px-5 tab-lg:text-sm tab-lg:py-1.5"
            >
              Go to homepage
            </Link>
            <Link
              href="/"
              className="bg-[#ff4040] uppercase flex items-center justify-center text-white text-base font-medium px-10 py-1 min-h-[48px]
  transition-all duration-300 hover:bg-white hover:text-black
  tab-lg:px-5 tab-lg:text-sm tab-lg:py-1.5"
            >
              View Models
            </Link>
          </div>
        </Wrapper>
      </Wrapper>
    );
  }
  if (error == 403) {
    return (
      <Wrapper className="bg-black min-h-[calc(100vh-252px)] flex justify-center items-center">
        <Wrapper>
          <div className="text-center font-bodoni text-9xl text-white">403</div>
          <div className="text-center font-gambetta text-2xl text-white">
            You don&apos;t have access.
          </div>
          <div className="flex gap-2 max-md-tab:flex-wrap mt-3 justify-center">
            <Link
              href="/"
              className="bg-[#ff4040] uppercase flex items-center justify-center text-white text-base font-medium px-10 py-1 min-h-[48px]
  transition-all duration-300 hover:bg-white hover:text-black
  tab-lg:px-5 tab-lg:text-sm tab-lg:py-1.5"
            >
              Go to homepage
            </Link>
            <Link
              href="/"
              className="bg-[#ff4040] uppercase flex items-center justify-center text-white text-base font-medium px-10 py-1 min-h-[48px]
  transition-all duration-300 hover:bg-white hover:text-black
  tab-lg:px-5 tab-lg:text-sm tab-lg:py-1.5"
            >
              View Models
            </Link>
          </div>
        </Wrapper>
      </Wrapper>
    );
  }
  if (error == 200) {
    return (
      <div>
        <div
          className={`text-white bg-black ${
            modelVideos?.length > 0 ? "" : "min-h-screen"
          }`}
        >
          <div className="flex justify-center text-3xl font-gambetta pt-[120px] pb-[70px]">
            {data?.title}
          </div>
          <div className="flex  flex-col justify-center">
            <div className="flex justify-center text-center max-w-[60%] mx-auto py-[20px] max-lg-mb:max-w-full max-lg-mb:px-4">
              <div dangerouslySetInnerHTML={{ __html: data?.description }} />{" "}
            </div>
          </div>
          <div className="flex justify-center my-3">
            <WishlistButton id={data?.id} type={"model"} />
          </div>
        </div>
        {/* {data && <UpcomingScene data={data} title={"Upcoming Scene"} />} */}
        {modelVideos && modelVideos.length > 0 && (
          <TopVideo
            title={`latest ${data.title} Videos`}
            videos={modelVideos}
            showAllVideo={false}
            showAllVideoButton={false}
          />
        )}
      </div>
    );
  }
};

export default Index;
