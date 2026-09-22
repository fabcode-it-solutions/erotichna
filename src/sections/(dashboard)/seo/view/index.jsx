"use client";
import HeaderHeading from "@/components/dashboard/HeaderHeading/HeaderHeading";
import React, { useEffect, useState } from "react";
import FilterBar from "@/components/dashboard/FilterBar/FilterBar";
import useAdmin from "@/contexts/admin/AdminDataProvider";
import Pagination from "@/components/global/pagination/Pagination";
import Link from "next/link";
import MobileHeader from "@/components/dashboard/MobileHeader/MobileHeader";

const Index = () => {
  const { allSEO, getAllSeo } = useAdmin();
  const [filterdPosts, setFiltredPosts] = useState([]);
  const limit = 24;
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [filterStatus, setFilterStatus] = useState("videos");
  const filters = [
    {
      label: "Videos",
      value: "videos",
    },
    // {
    //   label: "Pages",
    //   value: "pages",
    // },
    {
      label: "Models",
      value: "models",
    },
  ];
  const getActiveFilter = (e) => {
    setFilterStatus(e);
    getAllSeo(limit, 0, e);
  };

  const getIndex = (e) => {
    setIndex(e);
    getAllSeo(limit, e * limit, filterStatus);
  };
  useEffect(() => {
    if (allSEO) {
      setFiltredPosts(allSEO?.data);
      setCount(allSEO?.totalCount / limit < 2 ? 0 : allSEO?.totalCount / limit);
    }
  }, [allSEO]);
  return (
    <div>
      <HeaderHeading
        title="SEO"
        home={true}
        notification={false}
        search={true}
        description="See quick SEO fields about your data ."
      />
      <MobileHeader heading="SEO" />
      <FilterBar
        active={"videos"}
        tabStyle="pl-2.5 pr-2 max-lg-mb:!justify-center"
        items={filters}
        setActiveFilter={getActiveFilter}
        className="mb-diff-tabs order-tabs max-lg-mb:!mb-4 "
        wrapperStyle={"!gap-0 max-lg-mb:!gap-2 "}
        countStyle="!h-[13.71px] !w-[13.14px] !static !ml-[3px]"
      />
      {filterdPosts?.length > 0 && (
        <ul className="border-x border-warm w-full hidden max-md-tab:block">
          {filterdPosts.map((item, i) => (
            <div
              key={i}
              className={`bg-white p-3 border-stroke rounded-lg w-full mt-3`}
            >
              <div className="flex-1 text-sm font-medium font-satoshi leading-6 relative   text-[#151516] ">
               <strong> Meta Title:</strong> {item?.seo?.title}
              </div>
              <div className="flex-1 text-sm font-medium font-satoshi leading-6 relative   text-[#151516] ">
              <strong>  Meta Description:</strong> {item?.seo?.description}
              </div>
              <div className="flex-1 text-sm font-medium font-satoshi leading-6 relative   text-[#151516] ">
              <strong> Permalink:</strong> {item?.seo?.permalink}
              </div>
              <div className="flex-1 text-sm font-medium font-satoshi leading-6 relative   text-[#151516] ">
               <strong> Keywords:</strong> {item?.seo?.keywords.toString()}
              </div>
              <div className="mt-2">
                <Link
                  href={`/dashboard/seo/edit/${item?._id}?type=${filterStatus}`}
                  className="text-sm font-medium font-satoshi leading-6 relative max-md-tab:block max-md-tab:text-center max-md-tab:max-w-[150px]  text-[#151516] max-md-tab:bg-black max-md-tab:text-white max-md-tab:px-6 max-md-tab:py-2 max-md-tab:rounded-lg"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </ul>
      )}
      {filterdPosts?.length > 0 && (
        <ul className="flex bg-warm p-2 mt-8 max-md-tab:hidden">
          <li className="w-[40px] text-sm font-medium font-satoshi leading-6 relative   text-[#151516] ">
            S.no
          </li>
          <li className="flex-1 text-sm font-medium font-satoshi leading-6 relative   text-[#151516] ">
            Meta Title
          </li>
          <li className="flex-1 text-sm font-medium font-satoshi leading-6 relative   text-[#151516] ">
            Meta Description
          </li>
          <li className="flex-1 text-center text-sm font-medium font-satoshi leading-6 relative   text-[#151516] ">
            Permalink
          </li>
          <li className="flex-1 text-sm font-medium font-satoshi leading-6 relative text-right  text-[#151516] ">
            Keywords
          </li>
        </ul>
      )}
      {filterdPosts?.length > 0 && (
        <ul className="border-x border-warm max-md-tab:hidden">
          {filterdPosts.map((item, i) => (
            <li className={`flex p-2 ${i % 2 == 1 ? "bg-warm" : ""}`} key={i}>
              <div className="capitalize w-[40px] text-sm font-medium font-satoshi leading-6 relative   text-[#151516]">
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="capitalize text-sm font-bold font-satoshi leading-6 relative   text-[#151516]">
                  {item?.seo?.title}
                </div>
                <div className="flex gap-2 max-md-tab:flex-wrap items-center">
                  <Link
                    href={`/dashboard/seo/edit/${item?._id}?type=${filterStatus}`}
                    className="text-sm font-medium font-satoshi leading-6 relative   text-[#151516]"
                  >
                    Edit
                  </Link>
                </div>
              </div>
              <div className="flex-1 text-sm font-medium font-satoshi leading-6 relative   text-[#151516]">
                {item?.seo?.description
                  ? item?.seo?.description.slice(0, 50) + "..."
                  : "-"}
              </div>
              <div className="flex-1 text-center text-sm font-medium font-satoshi leading-6 relative   text-[#151516]">
                {item?.seo?.permalink}
              </div>
              <div className="flex-1 text-sm font-medium font-satoshi leading-6 relative  text-right text-[#151516]">
                {item?.seo?.keywords.toString()}
              </div>
            </li>
          ))}
        </ul>
      )}
      {filterdPosts?.length === 0 && (
        <div className="text-center  text-[#151516] text-base font-medium font-satoshi leading-5 tracking-[-0.14px]">
          No Record Found.
        </div>
      )}
      {count > 0 ? (
        <Pagination
          dark={true}
          count={count}
          getIndex={getIndex}
          index={index}
          visiblePages={8}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default Index;
