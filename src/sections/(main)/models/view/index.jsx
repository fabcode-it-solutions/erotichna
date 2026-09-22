/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import UpcomingScene from "@/sections/UpcomingScene";
import React, { useEffect } from "react";
import useTheme from "@/contexts/theme/ThemeProvider";
import Models from "@/sections/Models";
import useAdmin from "@/contexts/admin/AdminDataProvider";
import TitleDivider from "@/components/global/TitleDivider/TitleDivider";
import IconImage from "@/assets/icons/IconImage";
import { Container } from "@radix-ui/themes";
import Wrapper from "@/components/ui/wrapper/Wrapper";

const Index = () => {
  const { upcomingData } = useTheme();
  const { getEditorModelsDataAPI, editorModelsData, getAllModels, allmodels } =
    useAdmin();

  useEffect(() => {
    if (!editorModelsData) {
      getEditorModelsDataAPI();
    }
    if (!allmodels) {
      getAllModels("publish", 0, 0, "latest-scenes");
    }
  }, [editorModelsData, allmodels]);
  const handleSortByChange = async (e) => {
    getAllModels("publish", 0, 0, e.target.value);
  };
  useEffect(() => {
    getAllModels("publish", 0, 0, "latest-scenes");
  }, []);
  return (
    <div>
      {/* {editorModelsData && <MainVideoBanner data={editorModelsData} />} */}
      <div className=" py-8 md:py-10 min-3xl:py-15 bg-black"></div>
      <Wrapper className="bg-black pt-8">
        <Container className="px-4">
          <div className="w-full h-[1px] bg-white mx-auto"></div>
          <div className="text-white !flex justify-between gap-4 py-[10px] mx-auto items-center max-lg-mb:flex-wrap">
            <div>
              <h1 className="px-2.5 bg-black z-[1] relative mb-2xl:text-sm font-normal uppercase text-[25px] text-white leading-none">
                {" "}
                Models
              </h1>
            </div>
            <div className="flex gap-4">
              <div className="flex border border-white">
                <div className="uppercase font-satoshi font-[600] max-lg-mb:text-sm  px-2 pr-0 py-1 bg-transparent text-white">
                  Sort by :
                </div>
                <select
                  className="bg-transparent uppercase font-satoshi font-[600] pl-0  max-lg-mb:text-sm  px-2 py-1 outline-none focus:ring-2 focus:ring-none"
                  onChange={handleSortByChange}
                >
                  <option value="name" className="text-black">
                    Name
                  </option>
                  <option selected value="latest-scenes" className="text-black">
                    Latest Models
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div className="w-full h-[1px] bg-white mx-auto mb-[30px]"></div>
        </Container>
      </Wrapper>
      {/* <TitleDivider title={"Models"} /> */}
      {!allmodels && (
        <div className="grid min-3xl:grid-cols-6 mb-2xl:grid-cols-2 gap-2.5 p-[5px] bg-black">
          {" "}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((item, i) => (
            <div key={i} className="w-full relative ">
              <div className="pb-[170.97%] relative w-full bg-dark-150 animate-pulse rounded-lg">
                <IconImage className="fill-gray-600 w-10 h-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="text-xl leading-none  mb-2xl:text-base mt-[5px] font-normal  rounded-lg min-h-[25px] bg-dark-150 animate-pulse"></div>
            </div>
          ))}
        </div>
      )}
      {allmodels && (
        <Models title={"erotichna models"} models={allmodels || []} />
      )}
      {upcomingData?.upcoming && (
        <UpcomingScene data={upcomingData?.upcoming} />
      )}
    </div>
  );
};

export default Index;
