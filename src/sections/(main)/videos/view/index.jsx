/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useCallback, useEffect, useState } from "react";
import useAdmin from "@/contexts/admin/AdminDataProvider";
import Pagination from "@/components/global/pagination/Pagination";
import PostCard from "../PostCard";
import { Container } from "@radix-ui/themes";
import IconFilter from "@/assets/icons/IconFilter";
import VideoSkeleton from "@/components/global/Loading/VideoSkeleton/VideoSkeleton";
import IconClose from "@/assets/icons/IconClose";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const Index = ({ videosData }) => {
  const {
    allposts,
    getAllPosts,
    getAllCategories,
    categories,
    allmodels,
    getAllModels,
  } = useAdmin();
  const [filteredPosts, setFilteredPosts] = useState(false);
  const limit = 15;
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [filterStatus, setFilterStatus] = useState("published");
  const [showFilterBar, setShowFilterBar] = useState(false);
  const [sortBy, setSortBy] = useState("latest-scenes");
  const [selectFilter, setSelectFilter] = useState("Category");
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const getIndex = (e) => {
    setIndex(e);
    router.push(pathname + "?" + createQueryString("page", e + 1));
    getAllPosts(limit, e * limit, filterStatus, "customer");
  };

  const handleSortByChange = async (e) => {
    const sortByValue = e.target.value;
    setSortBy(sortByValue);
    try {
      fetch(
        `/api/admin/post?sort=${sortByValue}&filter=${selectFilter}&query=${selectedTag}&limit=${limit}&skip=${
          index * limit
        }`
      )
        .then((res) => res.json())
        .then((res) => {
          setFilteredPosts(res?.data?.slice(0, showFilterBar ? 12 : limit));
          setCount(Math.ceil(res?.totalCount / (showFilterBar ? 12 : limit)));
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleFilterClick = () => {
    setShowFilterBar((prev) => !prev);
  };

  useEffect(() => {
    console.log(allposts);
    if (allposts) {
      setFilteredPosts(allposts?.data?.slice(0, limit));
      setCount(Math.ceil(allposts?.totalCount / limit));
    }
  }, [allposts]);

  useEffect(() => {
    if (!categories) {
      getAllCategories();
    }
  }, [categories]);

  useEffect(() => {
    if (!allmodels) {
      getAllModels("publish", 0, 0, "latest-scenes");
    }
  }, [allmodels]);

  useEffect(() => {
    if (selectFilter === "Category" && categories) {
      setTags(categories);
    }
  }, [selectFilter, categories]);

  const handleSelectFilter = (filter) => {
    setSelectFilter(filter);
    if (filter === "Girls") {
      setTags(allmodels);
    } else if (filter === "Category") {
      setTags(categories);
    }
  };

  const handleTagSelect = async (tag) => {
    setSelectedTag(tag);
    try {
      fetch(
        `/api/admin/post?sort=${sortBy}&filter=${selectFilter}&query=${tag}&limit=${limit}&skip=${
          index * limit
        }`
      )
        .then((res) => res.json())
        .then((res) => {
          setFilteredPosts(res?.data?.slice(0, showFilterBar ? 12 : limit));
          setCount(Math.ceil(res?.totalCount / (showFilterBar ? 12 : limit)));
        });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const pages = searchParams.get("page");
    if (pages) {
      const pageIndex = pages - 1;
      setIndex(pageIndex);
      getAllPosts(limit, pageIndex * limit, "published", "customer");
    } else {
      getAllPosts(limit, 0, "published", "customer");
    }
  }, []);
  useEffect(() => {
    if (selectedTag === "reset") {
      getAllPosts(limit, 0, "published", "customer");
    }
  }, [selectedTag]);
  useEffect(() => {
    if (!filteredPosts) {
      setFilteredPosts(videosData?.data?.slice(0, showFilterBar ? 12 : limit));
      setCount(
        Math.ceil(videosData?.totalCount / (showFilterBar ? 12 : limit))
      );
    }
  }, [videosData]);

  return (
    <div className="pt-[150px]">
      <Container className="px-4">
        <div className="w-full h-[1px] bg-white mx-auto"></div>
        <div className="text-white !flex justify-between gap-4 py-[10px] mx-auto items-center max-lg-mb:flex-wrap">
          <h1 className="uppercase font-satoshi font-[600] flex items-center gap-2 ">
            {selectedTag && selectedTag != "reset"
              ? `Showing results for "${selectedTag}"`
              : "Latest Erotichna videos"}
            {selectedTag && selectedTag != "reset" && (
              <button
                onClick={() => setSelectedTag("reset")}
                className="flex items-center gap-2 bg-[#ff4040] px-3 py-1 text-sm uppercase rounded-lg"
              >
                Reset Filter <IconClose stroke="#fff" className="w-2.5 h-2.5" />{" "}
              </button>
            )}
          </h1>
          <div className="flex gap-4">
            <div className="flex border border-white">
              <div className="uppercase font-satoshi font-[600] max-lg-mb:text-sm  px-2 pr-0 py-1 bg-transparent text-white">
                Sort by :
              </div>
              <select
                className="bg-transparent uppercase font-satoshi font-[600] pl-0  max-lg-mb:text-sm  px-2 py-1 outline-none focus:ring-2 focus:ring-none"
                onChange={handleSortByChange}
              >
                <option value="latest-scenes" className="text-black">
                  Latest Scenes
                </option>
                <option value="highest-rating" className="text-black">
                  Highest Rating
                </option>
              </select>
            </div>
            <button
              className="uppercase font-satoshi font-[600]  max-lg-mb:text-sm  cursor-pointer border transition-all duration-300 
              border-white px-2 py-1 flex items-center gap-2"
              onClick={handleFilterClick}
            >
              <IconFilter fill="#fff" /> Filter
            </button>
          </div>
        </div>
        <div className="w-full h-[1px] bg-white mx-auto mb-[30px]"></div>
      </Container>
      {showFilterBar && (
        <div className=" w-full max-lg-mb:block hidden mb-6">
          <FilterBar
            selectFilter={selectFilter}
            tags={tags}
            onFilterChange={handleSelectFilter}
            onTagSelect={handleTagSelect} // Pass the function to handle tag selection
            selectedTag={selectedTag}
          />
        </div>
      )}
      <div
        className={`
          
          ${
            showFilterBar
              ? "w-full max-w-[1136px] mx-auto flex gap-6 items-start"
              : "w-full"
          } gap-1.5 hide-scroll-bar`}
      >
        {showFilterBar && (
          <div className="max-w-[260px] w-full max-lg-mb:hidden">
            <FilterBar
              selectFilter={selectFilter}
              tags={tags}
              onFilterChange={handleSelectFilter}
              onTagSelect={handleTagSelect} // Pass the function to handle tag selection
              selectedTag={selectedTag}
            />
          </div>
        )}
        {!filteredPosts && (
          <div
            className={`
               max-lg-mb:px-4 max-lg-mb:grid-cols-1 ${
                 showFilterBar
                   ? "w-full mx-auto grid grid-cols-2 gap-2"
                   : "w-full  grid grid-cols-3 max-lg-dx:grid-cols-2 gap-2"
               }`}
          >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((item, i) => (
              <VideoSkeleton key={i} />
            ))}
          </div>
        )}
        {filteredPosts?.length === 0 && (
          <div className="text-center w-full text-white text-base font-medium font-satoshi leading-5 tracking-[-0.14px]">
            No Record Found.
          </div>
        )}
        {filteredPosts?.length > 0 && (
          <div
            className={`
              max-lg-mb:px-4 max-lg-mb:grid-cols-1 ${
                showFilterBar
                  ? "w-full mx-auto grid grid-cols-2 gap-2"
                  : "w-full  grid grid-cols-3 max-lg-dx:grid-cols-2 gap-2"
              }`}
          >
            {filteredPosts.map((item, i) => (
              <PostCard key={i} item={item} />
            ))}
          </div>
        )}
      </div>

      <div className="py-[25px]">
        {count > 1 ? (
          <Pagination
            count={count}
            getIndex={getIndex}
            index={index}
            visiblePages={8}
            dark={false}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Index;

function FilterBar({
  selectFilter,
  tags,
  onFilterChange,
  onTagSelect,
  selectedTag,
}) {
  const filters = ["Category", "Girls"];

  return (
    <>
      <div className="bg-dark-150  h-full shadow-lg p-4 pt-2">
        <div className="text-white font-semibold uppercase py-2 px-0 text-xl font-satoshi">
          Filter by :
        </div>

        {/* Filters Dropdown */}
        <div>
          <select
            className="bg-transparent text-red-400  px-4 py-2 w-full outline-none border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-400"
            onChange={(e) => onFilterChange(e.target.value)} // Update filter when changed
          >
            {filters.map((filter, index) => (
              <option value={filter} className="text-black" key={index}>
                {filter}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 overflow-y-auto max-lg-mb:columns-2	 scrollbar-thin scrollbar-thumb-red-400 scrollbar-track-transparent">
          {tags?.length > 0 ? (
            tags.map((tag, index) => (
              <div
                key={index}
                className={`${
                  selectedTag == tag.title ? "bg-red-500" : ""
                }  text-white cursor-pointer capitalize text-sm font-medium rounded-md px-2 py-1 mb-1 flex justify-between items-center transition duration-200 hover:bg-[#555]`}
                onClick={() => onTagSelect(tag.title)} // Handle tag selection
              >
                <span>{tag.title}</span>
              </div>
            ))
          ) : (
            <div className="text-white">No Tags Available</div>
          )}
        </div>
      </div>
    </>
  );
}
