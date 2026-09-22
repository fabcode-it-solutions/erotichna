"use client";
import IconSearch from "@/assets/icons/IconSearch";
import Wrapper from "@/components/ui/wrapper/Wrapper";
import useAdmin from "@/contexts/admin/AdminDataProvider";
import React, { useEffect, useState } from "react";
import InputDashboard from "../InputDashboard/InputDashboard";
import IconView from "@/assets/icons/Iconview";
import IconWatch from "@/assets/icons/IconWatch";
import Image from "next/image";

const GetModelData = ({ setVideoDetails, placeholder }) => {
  const [search, setSearch] = useState("");
  const [filteredVideos, setFilteredVideos] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`/api/admin/search/model?query=${search}`);
        const data = await response.json();
        setFilteredVideos(data.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
      }
    };
    const delayDebounceFn = setTimeout(() => {
      fetchResults();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);
  const getSearch = async (e) => {
    setSearch(e.target.value);
  };

  const getVideoDetails = (item) => {
    setVideoDetails(item);
    setSearch("");
  };
  return (
    <Wrapper className="relative">
      <InputDashboard
        setInputData={getSearch}
        value={search}
        placeholder={placeholder || "Search video by title or tags..."}
        className="min-w-[432px] xxl-dx:min-w-[320px] max-lg-mb:min-w-[auto]"
      />

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
            <div className="max-h-[220px] w-full  overflow-auto pb-6 flex-col justify-start items-start gap-2 flex hide-scroll-bar">
              {filteredVideos.length > 0 &&
                filteredVideos.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => getVideoDetails(item)}
                    className=" bg-white p-2 w-full shadow-10xl-large rounded-lg flex items-center gap-4 relative cursor-pointer"
                  >
                    <div className="w-[90px] min-w-[90px] min-h-[75px] bg-[#f5f4f2] rounded ">
                      <Image
                        src={
                          item.profile_image?.replace(
                            "https://storage.bunnycdn.com/assets-erotichna",
                            "https://files-erotichna.b-cdn.net"
                          ) ?? "/assets/images/Backrouns_image.jpg"
                        }
                        width={90}
                        height={75}
                        alt="Backround image"
                        className="w-full h-full min-h-[75px] object-cover rounded"
                      />
                    </div>
                    <div>
                      <div className=" text-[#151516] text-sm font-medium font-satoshi leading-4 tracking-[-0.14px]">
                        {item?.title}
                      </div>
                      <p className=" text-[#7f7f7f] text-xs font-medium font-satoshi my-1 leading-4 tracking-[-0.14px]">
                        {item?.expert}
                      </p>
                      <div className="flex gap-[15px] mt-2">
                        {item?.videoView && (
                          <span className="text-[#7f7f7f] text-xs font-normal font-satoshi leading-3 flex items-center gap-2">
                            <IconView className="w-4 h-4" />{" "}
                            <span className="text-[#232323]">
                              {item?.videoView}
                            </span>
                          </span>
                        )}
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
                ))}
              {filteredVideos.length === 0 && (
                <div className="text-center  text-[#151516] text-base font-medium font-satoshi leading-5 tracking-[-0.14px]">
                  No Record Found.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Wrapper>
  );
};

export default GetModelData;
