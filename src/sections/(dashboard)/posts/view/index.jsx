/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import HeaderHeading from "@/components/dashboard/HeaderHeading/HeaderHeading";
import React, { use, useEffect, useRef, useState } from "react";
import PostCard from "../PostCard";
import FilterBar from "@/components/dashboard/FilterBar/FilterBar";
import Pagination from "@/components/global/pagination/Pagination";
import MobileHeader from "@/components/dashboard/MobileHeader/MobileHeader";
import useAuth from "@/contexts/auth/AuthProvider";
import ToastSuccess from "@/components/global/Toasts/ToastSuccess";
import ToastError from "@/components/global/Toasts/ToastError";
import IconDragDots from "@/assets/icons/IconDragDots";
import { createSwapy } from "swapy";
import Loader from "@/components/global/Loading/Loader";
import { reorderVideo } from "@/actions/videoOrder";

const Index = () => {
  const swapy = useRef(null);
  const container = useRef(null);
  const { user } = useAuth();
  const [filterdPosts, setFiltredPosts] = useState(false);
  const [sort, setSorting] = useState("new-to-old");
  const [loadingData, setLoadingData] = useState(false);
  const limit = 24;
  const [totalCount, setTotalCount] = useState(0);
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [filterStatus, setFilterStatus] = useState("all");
  const [success, setSuccess] = useState({});
  const [error, setError] = useState({});
  const [loader, setLoader] = useState(false);
  const [orderChanged, setOrderChanged] = useState(false);
  const [orderChangeInput, setOrderChangeInput] = useState(false);
  const [orderUpdate, setOrderUpdate] = useState(true);
  const pageStartNumber = index * limit + 1;
  const [newPosition, setNewPosition] = useState({});
  const filters = [
    {
      label: "All",
      value: "all",
    },
    {
      label: "Published",
      value: "published",
    },
    {
      label: "Draft",
      value: "draft",
    },
    {
      label: "Schedule",
      value: "schedule",
    },
    {
      label: "Pending Review",
      value: "pending",
    },
  ];
  const getActiveFilter = (e) => {
    setFilterStatus(e);
  };

  const getIndex = (e) => {
    setIndex(e);
  };

  const getVideos = async (e) => {
    try {
      setLoadingData(true);
      const response = await fetch(
        `/api/admin/post/admin-sorting?sort=${e}&status=${filterStatus}&limit=${limit}&skip=${
          index * limit
        }`,
        {
          method: "GET",
          headers: {
            "X-TOKEN": user.userID || null,
          },
        }
      );
      const data = await response.json();
      if (data) {
        setFiltredPosts(data?.items);
        setTotalCount(data?.totalCount);
        setCount(
          data?.totalCount / limit <= 1
            ? 0
            : Math.ceil(data?.totalCount / limit)
        );
      }
    } catch (error) {
    } finally {
      setTimeout(() => {
        setLoadingData(false);
      }, 300);
      setTimeout(() => {
        if (container.current) {
          swapy.current = createSwapy(container.current, {});
          swapy.current.onSwap((event) => {
            setOrderChanged(true);
          });
        }
      }, 1500);
    }
  };
  useEffect(() => {
    getVideos(sort);
  }, [sort, index, filterStatus, user]);
  const hasNoNewOrder = (data) => {
    return !Object.values(data).some((order) => order.newOrder !== undefined);
  };
  const hasNoSameNumber = (data, value) => {
    return !Object.values(data).some((order) => order.newOrder === value);
  };
  useEffect(() => {
    const result = hasNoNewOrder(orderChangeInput);
    setOrderUpdate(result);
  }, [orderChangeInput]);
  const sorting = async (e) => {
    setSorting(e.target.value);
  };

  const updateOrder = async (e) => {
    e.preventDefault();

    try {
      setLoader({
        active: true,
        message: "Updating order...",
      });
      const response = await reorderVideo(
        newPosition.videoId,
        parseInt(newPosition.newPosition)
      );
      console.log(response);

      if (response?.success) {
        setLoader(false);
        setSuccess({
          active: true,
          message: response?.message,
        });
        await getVideos(sort);
        setNewPosition({});
        setOrderChanged(false);
      } else {
        setError({
          active: true,
          message: response?.message,
        });
        setLoader(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div>
      {loader?.active && <Loader message={loader.message} />}
      {success?.active && (
        <ToastSuccess
          active={success?.active}
          message={success?.message}
          setSuccess={setSuccess}
        />
      )}
      {error?.active && (
        <ToastError
          active={error?.active}
          message={error?.message}
          setError={setError}
        />
      )}
      <HeaderHeading
        title="Videos"
        home={true}
        notification={false}
        search={true}
        description="See quick data about your videos."
      />
      <MobileHeader heading="Videos" />
      <div className="flex items-center gap-4 !mt-[34px] max-lg-mb:flex-wrap max-lg-mb:gap-0">
        <FilterBar
          active={"all"}
          tabStyle="pl-2.5 pr-2 max-lg-mb:!justify-center"
          items={filters}
          setActiveFilter={getActiveFilter}
          className="mb-diff-tabs order-tabs max-lg-mb:!mb-4 flex-1 !mt-0 max-lg-mb:flex-none"
          wrapperStyle={"!gap-0 max-lg-mb:!gap-2  "}
          countStyle="!h-[13.71px] !w-[13.14px] !static !ml-[3px]"
        />
        <div className="flex justify-between items-center max-lg-mb:!mb-0 max-lg-mb:w-full">
          <label className="text-sm text-dark-150 font-satoshi leading-5">
            Sort by
          </label>
          <select
            onChange={(e) => {
              sorting(e);
            }}
            className="w-40 h-10 ml-2 border border-stroke rounded-lg px-4 text-sm text-dark-150 font-satoshi leading-5 tracking-[-0.14px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            name="cars"
            id="cars"
          >
            <option value="new-to-old">New to old</option>
            <option value="old-to-new">Old to new</option>
            <option value="a-z">A - Z</option>
            <option value="z-a">Z - A</option>
          </select>
        </div>
        {newPosition.newPosition && (
          <button
            onClick={(e) => updateOrder(e)}
            type="button"
            className="text-center py-3 max-lg-mb:mt-2 bg-black  text-white px-5 rounded-lg text-sm font-satoshi"
          >
            Update Order
          </button>
        )}
        {newPosition.newPosition && (
          <button
            onClick={(e) => setNewPosition({})}
            type="button"
            className="text-center py-3  max-lg-mb:mt-2  max-lg-mb:ml-2 bg-red-500  text-white px-5 rounded-lg text-sm font-satoshi"
          >
            Cancel
          </button>
        )}
      </div>

      <div
        ref={container}
        className="w-full grid grid-cols-4 gap-4 max-xl-dx:grid-cols-3 max-md-dx:grid-cols-2 max-xsm-tab:grid-cols-1   hide-scroll-bar my-6"
      >
        {!filterdPosts &&
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
            <div
              key={i}
              role="status"
              className="flex items-center justify-center h-56 max-w-sm bg-gray-75 rounded-lg animate-pulse "
            >
              <svg
                className="w-10 h-10 text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 16 20"
              >
                <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z" />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          ))}
        {loadingData &&
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
            <div
              key={i}
              role="status"
              className="flex items-center justify-center h-56 max-w-sm bg-gray-75 rounded-lg animate-pulse "
            >
              <svg
                className="w-10 h-10 text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 16 20"
              >
                <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z" />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          ))}
        {filterdPosts?.length > 0 &&
          !loadingData &&
          filterdPosts.map((item, i) => (
            <div
              key={i}
              className="p-2 border-dashed border-gray-400 rounded-lg border "
            >
              {!orderChangeInput || orderChangeInput[item._id]?.prevOrder ? (
                <input
                  value={orderChangeInput[item._id]?.newOrder || ""}
                  // placeholder={totalCount + 1 - item?.orderTemp || index || ""}
                  placeholder={pageStartNumber + i}
                  onBlur={(e) =>
                    orderChangeInput[item._id]?.newOrder
                      ? ""
                      : setOrderChangeInput(false)
                  }
                  onChange={(e) => {
                    // if (totalCount >= e.target.value) {
                    if (totalCount >= e.target.value && e.target.value >= 1) {
                      setNewPosition({
                        newPosition: e.target.value,
                        videoId: item._id,
                      });
                      if (e.target.value == item.order) {
                        setNewPosition({});
                      }
                      setOrderChangeInput((prev) => ({
                        ...prev,
                        [item._id]: {
                          ...prev[item._id],
                          newOrder: e.target.value
                            ? parseInt(e.target.value)
                            : undefined,
                          // prevOrder: limit * index + i + 1,
                          prevOrder: pageStartNumber + i,
                        },
                      }));
                    } else {
                      setError({
                        active: true,
                        // message: `The maximum allowed number is ${totalCount}. You cannot add a number greater than ${totalCount}.`,
                        message: `Number must be between 1 and ${totalCount}.`,
                      });
                    }
                  }}
                  type="number"
                  style={{ "-moz-appearance": "textfield" }}
                  className={`mt-[-19px] text-center text-xs block  ml-[-19px] w-6 h-6 rounded-full bg-white border font-bold ${
                    orderChangeInput[item._id]?.newOrder
                      ? "border-gray-800  border-solid"
                      : "border-gray-400  border-dashed"
                  }`}
                />
              ) : (
                <div className="mt-[-19px] text-center text-xs text-gray-200 flex items-center justify-center  ml-[-19px] w-6 h-6 rounded-full bg-white border-dashed border border-gray-200 font-bold">
                  {/* {totalCount + 1 - (item?.orderTemp || index) || ""} */}
                  {pageStartNumber + i}
                </div>
              )}
              <div
                className="swapy-slot"
                data-swapy-slot={
                  index > 0
                    ? totalCount - (limit * index + i + 1)
                    : totalCount - (i + 1)
                }
              >
                <div className="swapy-item relative" data-swapy-item={item._id}>
                  <div data-swapy-handle>
                    <button className="absolute !hidden top-4 left-4 z-[2]">
                      <IconDragDots />
                    </button>
                  </div>
                  <PostCard
                    item={item}
                    limit={limit}
                    skip={0}
                    getVideos={() => getVideos(sort)}
                    filterStatus={filterStatus}
                  />
                </div>
              </div>
            </div>
          ))}
      </div>

      {filterdPosts?.length === 0 && (
        <div className="text-center  text-[#151516] text-base font-medium font-satoshi leading-5 tracking-[-0.14px]">
          No Record Found.
        </div>
      )}
      {count > 0 && !loadingData ? (
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
      {newPosition.newPosition && (
        <div className="sticky -bottom-6 p-2 flex justify-center  z-[999] w-full">
          <div className="bg-white py-2 p-4 rounded-xl flex gap-4 bg-opacity-20 backdrop-blur-sm border-2 border-custom-red">
            <button
              onClick={(e) => updateOrder(e)}
              type="button"
              className="text-center min-w-[125px] py-3 max-lg-mb:mt-2 bg-black  text-white px-5 rounded-lg text-sm font-satoshi"
            >
              Update Order
            </button>

            <button
              onClick={(e) => setNewPosition({})}
              type="button"
              className="text-center py-3 min-w-[125px]  max-lg-mb:mt-2  max-lg-mb:ml-2 bg-red-500  text-white px-5 rounded-lg text-sm font-satoshi"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
