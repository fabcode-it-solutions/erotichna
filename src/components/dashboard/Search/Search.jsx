"use client";
import IconSearch from "@/assets/icons/IconSearch";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import InputDashboard from "../InputDashboard/InputDashboard";
import Wrapper from "@/components/ui/wrapper/Wrapper";
import IconWatch from "@/assets/icons/IconWatch";
import IconView from "@/assets/icons/Iconview";
import useAdmin from "@/contexts/admin/AdminDataProvider";
const Search = ({ placeholder }) => {
  const { allposts } = useAdmin();
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [filteredVideos, setFilteredVideos] = useState({
    models: [],
    videos: [],
  });

  const fetchResults = async (search) => {
    try {
      const response = await fetch(`/api/admin/search/admin?query=${search}`);
      const data = await response.json();

      if (!data?.error) {
        setFilteredVideos(data);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      setError("An error occurred while searching.");
    } finally {
    }
  };

  const getSearch = (e) => {
    setSearch(e.target.value);
    fetchResults(e.target.value);
  };
  return (
    <Wrapper className="relative">
      <InputDashboard
        setInputData={getSearch}
        value={search}
        placeholder={placeholder || "Search model or video"}
        className="min-w-[432px] xxl-dx:min-w-[320px]  max-lg-mb:min-w-[auto] !py-[9px] !h-[38px] !bg-gray"
      />
      <IconSearch className="absolute top-[9px] right-[15px] pointer-events-none" />
      {search && (
        <div
          className={`max-h-[418px] px-4 w-[calc(100%+32px)] -ml-4 absolute top-[39px] z-[999]`}
        >
          <div
            className={` mt-[13.5px] w-full px-4 pt-3 pb-0 bg-[#f7f7f7] shadow-5xl rounded-md flex-col justify-start items-start gap-3 inline-flex`}
          >
            <div className="text-center text-[#151516] text-xs font-medium font-satoshi leading-7">
              Search results
            </div>
            {filteredVideos?.models.length == 0 &&
              filteredVideos?.videos.length == 0 && (
                <div className="text-center  text-[#151516] text-sm font-medium font-satoshi leading-5 tracking-[-0.14px]">
                  No Record Found.
                </div>
              )}
            <div className="max-h-[367px] w-full   overflow-auto hide-scroll-bar">
              <div className="pb-6  gap-6 flex ">
                {filteredVideos?.models.length > 0 && (
                  <div className="flex-1">
                    <div className="flex flex-col items-start gap-2 sticky top-0 max-h-[360px] w-full   overflow-auto hide-scroll-bar">
                      <div className="text-center text-[#151516] text-sm font-medium font-satoshi leading-7">
                        Models
                      </div>
                      {filteredVideos?.models.length > 0 ? (
                        filteredVideos?.models.map((item, i) => (
                          <div
                            key={i}
                            className=" bg-white w-full hover:bg-stroke shadow-10xl-large rounded-lg flex items-center pr-6 gap-2 relative"
                          >
                            <Link
                              href={`/dashboard/models/edit/${item?.seo?.permalink}`}
                              className="absolute top-0 w-full h-full left-0"
                            ></Link>
                            <div className="bg-[#f5f4f2] rounded ">
                              <Image
                                src={
                                  item?.profile_image?.replace(
                                    "https://storage.bunnycdn.com/assets-erotichna",
                                    "https://files-erotichna.b-cdn.net"
                                  ) || "/assets/images/Backrouns_image.jpg"
                                }
                                width={150}
                                unoptimized={true}
                                height={150}
                                alt="profile image"
                                className="w-12 h-12 min-w-12 min-h-12  object-cover rounded"
                              />
                            </div>
                            <div>
                              <div className=" text-[#151516] text-sm font-medium font-satoshi leading-4 tracking-[-0.14px]">
                                {item?.title}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center  text-[#151516] text-sm font-medium font-satoshi leading-5 tracking-[-0.14px]">
                          No Record Found.
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {filteredVideos?.videos.length > 0 && (
                  <div className="flex flex-col items-start gap-2 flex-[2]">
                    <div className="text-center text-[#151516] text-sm font-medium font-satoshi leading-7">
                      Videos
                    </div>
                    {filteredVideos?.videos.length > 0 ? (
                      filteredVideos?.videos.map((item, i) => (
                        <div
                          key={i}
                          className=" bg-white hover:border-dark-150 border-white border p-2 w-full shadow-10xl-large rounded-lg
                       relative"
                        >
                          <Link
                            href={`/dashboard/videos/edit/${item?.seo?.permalink}`}
                            className="absolute top-0 w-full h-full left-0"
                          ></Link>
                          <div className=" bg-[#f5f4f2] rounded ">
                            <Image
                              src={
                                item?.poster?.replace(
                                  "https://storage.bunnycdn.com/assets-erotichna",
                                  "https://files-erotichna.b-cdn.net"
                                ) || "/assets/images/Backrouns_image.jpg"
                              }
                              width={150}
                              height={150}
                              unoptimized={true}
                              alt="Backround image"
                              className="w-full h-full  object-cover rounded"
                            />
                          </div>
                          <div>
                            <div className="mt-3 text-[#151516] text-sm font-medium font-satoshi leading-4 tracking-[-0.14px]">
                              {item?.title}
                            </div>
                            {item?.description && (
                              <div
                                dangerouslySetInnerHTML={{
                                  __html:
                                    item?.description.slice(0, 50) + "...",
                                }}
                                className=" text-[#7f7f7f] text-xs font-medium font-satoshi my-1 leading-4 tracking-[-0.14px]"
                              ></div>
                            )}
                            <div className="flex gap-[15px] mt-2">
                              <span className="text-[#7f7f7f] text-xs font-normal font-satoshi leading-3 flex items-center gap-2">
                                <IconView className="w-4 h-4" />{" "}
                                <span className="text-[#232323]">
                                  {item?.videoView || 0}
                                </span>
                              </span>
                              {item?.video?.duration && (
                                <span className="text-[#7f7f7f] text-xs font-normal font-satoshi leading-3 flex items-center gap-2">
                                  <IconWatch className="w-4 h-4" />{" "}
                                  <span className="text-[#232323]">
                                    {item?.video?.duration}
                                  </span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center  text-[#151516] text-sm font-medium font-satoshi leading-5 tracking-[-0.14px]">
                        No Record Found.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Wrapper>
  );
};

export default Search;
